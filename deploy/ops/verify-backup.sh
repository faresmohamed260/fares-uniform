#!/usr/bin/env bash
set -euo pipefail

[[ $# -eq 1 ]] || { echo "usage: verify-backup.sh /backups/<set>" >&2; exit 64; }
SET_DIR="$1"
[[ -d "$SET_DIR" ]] || { echo "Backup set directory not found: $SET_DIR" >&2; exit 66; }

for required in manifest.json checksums.sha256 database.dump filestore.tar.gz; do
  [[ -f "$SET_DIR/$required" ]] || { echo "Incomplete backup set: missing $required" >&2; exit 65; }
done

(
  cd "$SET_DIR"
  sha256sum -c checksums.sha256
)

jq -e '
  .format_version == 1 and
  (.backup_set | type == "string" and length > 0) and
  (.fares_sha | test("^[0-9a-f]{40}$")) and
  (.odoo_sha | test("^[0-9a-f]{40}$")) and
  (.database | test("^[A-Za-z0-9_]+$")) and
  (.components == ["database.dump", "filestore.tar.gz"])
' "$SET_DIR/manifest.json" >/dev/null

DB_NAME="$(jq -r '.database' "$SET_DIR/manifest.json")"
BACKUP_SET="$(jq -r '.backup_set' "$SET_DIR/manifest.json")"
MANIFEST_FARES_SHA="$(jq -r '.fares_sha' "$SET_DIR/manifest.json")"
MANIFEST_ODOO_SHA="$(jq -r '.odoo_sha' "$SET_DIR/manifest.json")"

[[ "$(basename "$SET_DIR")" == "$BACKUP_SET" ]] || {
  echo "Backup directory name does not match manifest backup_set" >&2
  exit 65
}

if [[ -n "${EXPECTED_FARES_SHA:-}" && "$MANIFEST_FARES_SHA" != "$EXPECTED_FARES_SHA" ]]; then
  echo "Fares SHA mismatch: manifest=$MANIFEST_FARES_SHA expected=$EXPECTED_FARES_SHA" >&2
  exit 65
fi
if [[ -n "${EXPECTED_ODOO_SHA:-}" && "$MANIFEST_ODOO_SHA" != "$EXPECTED_ODOO_SHA" ]]; then
  echo "Odoo SHA mismatch: manifest=$MANIFEST_ODOO_SHA expected=$EXPECTED_ODOO_SHA" >&2
  exit 65
fi
if [[ -n "${ODOO_DB_NAME:-}" && "$DB_NAME" != "$ODOO_DB_NAME" ]]; then
  echo "Database name mismatch: manifest=$DB_NAME target=$ODOO_DB_NAME" >&2
  exit 65
fi

# Reject archives containing absolute paths, traversal, or content outside the expected database filestore root.
while IFS= read -r entry; do
  [[ -n "$entry" ]] || continue
  [[ "$entry" != /* ]] || { echo "Unsafe absolute filestore path: $entry" >&2; exit 65; }
  [[ "$entry" != *"../"* && "$entry" != ".." ]] || { echo "Unsafe filestore traversal path: $entry" >&2; exit 65; }
  [[ "$entry" == "$DB_NAME" || "$entry" == "$DB_NAME/" || "$entry" == "$DB_NAME/"* ]] || {
    echo "Unexpected filestore root: $entry" >&2
    exit 65
  }
done < <(tar -tzf "$SET_DIR/filestore.tar.gz")

pg_restore --list "$SET_DIR/database.dump" >/dev/null
printf 'Verified backup set %s\n' "$BACKUP_SET"
