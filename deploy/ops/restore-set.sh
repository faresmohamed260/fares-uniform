#!/usr/bin/env bash
set -euo pipefail

[[ $# -eq 1 ]] || { echo "usage: restore-set.sh /backups/<set>" >&2; exit 64; }
SET_DIR="$1"

: "${ODOO_DB_HOST:=db}"
: "${ODOO_DB_PORT:=5432}"
: "${ODOO_DB_NAME:=fares}"
: "${ODOO_DB_USER:=fares_app}"
: "${ODOO_DB_PASSWORD_FILE:?ODOO_DB_PASSWORD_FILE is required}"
: "${ODOO_DATA_DIR:=/var/lib/odoo}"
: "${ODOO_RUNTIME_UID:=10001}"
: "${ODOO_RUNTIME_GID:=10001}"

[[ "$ODOO_RUNTIME_UID" =~ ^[0-9]+$ ]] || { echo "ODOO_RUNTIME_UID must be numeric" >&2; exit 64; }
[[ "$ODOO_RUNTIME_GID" =~ ^[0-9]+$ ]] || { echo "ODOO_RUNTIME_GID must be numeric" >&2; exit 64; }
[[ "$(id -u)" == "0" ]] || { echo "Restore must run as root to initialize Odoo volume ownership" >&2; exit 77; }

/opt/fares/verify-backup.sh "$SET_DIR"

[[ -r "$ODOO_DB_PASSWORD_FILE" ]] || { echo "Database password file is not readable" >&2; exit 64; }
export PGPASSWORD="$(<"$ODOO_DB_PASSWORD_FILE")"
[[ -n "$PGPASSWORD" ]] || { echo "Database password is empty" >&2; exit 64; }

TABLE_COUNT="$(psql \
  --host="$ODOO_DB_HOST" \
  --port="$ODOO_DB_PORT" \
  --username="$ODOO_DB_USER" \
  --dbname="$ODOO_DB_NAME" \
  --tuples-only --no-align \
  --command="SELECT count(*) FROM pg_tables WHERE schemaname = 'public';")"
[[ "$TABLE_COUNT" == "0" ]] || {
  echo "Restore target is not clean: public schema has $TABLE_COUNT table(s)" >&2
  exit 65
}

FILESTORE_ROOT="${ODOO_DATA_DIR}/filestore"
FILESTORE_DB="${FILESTORE_ROOT}/${ODOO_DB_NAME}"
if [[ -e "$FILESTORE_DB" ]] && [[ -n "$(find "$FILESTORE_DB" -mindepth 1 -print -quit 2>/dev/null)" ]]; then
  echo "Restore target filestore is not empty: $FILESTORE_DB" >&2
  exit 65
fi

# A newly-created named volume is mounted over the image's pre-owned data
# directory. Initialize the volume root at the privileged ops boundary so the
# production Odoo process can remain fixed at the non-root 10001:10001 identity.
install -d -o "$ODOO_RUNTIME_UID" -g "$ODOO_RUNTIME_GID" -m 0750 "$ODOO_DATA_DIR"
install -d -o "$ODOO_RUNTIME_UID" -g "$ODOO_RUNTIME_GID" -m 0750 "$FILESTORE_ROOT"
rm -rf "$FILESTORE_DB"

# The clean database bootstrap owns required extensions as postgres. Restore as
# the least-privileged application role while skipping COMMENT ON EXTENSION
# statements that require extension ownership but do not affect application data.
pg_restore \
  --host="$ODOO_DB_HOST" \
  --port="$ODOO_DB_PORT" \
  --username="$ODOO_DB_USER" \
  --dbname="$ODOO_DB_NAME" \
  --no-owner \
  --no-acl \
  --no-comments \
  --exit-on-error \
  "$SET_DIR/database.dump"

# Restore archived numeric ownership across hosts. The fixed runtime UID/GID is
# intentional so restored filestore paths remain writable by non-root Odoo.
tar --numeric-owner --same-owner -C "$FILESTORE_ROOT" -xzf "$SET_DIR/filestore.tar.gz"
[[ -d "$FILESTORE_DB" ]] || { echo "Restored filestore root is missing" >&2; exit 65; }
[[ "$(stat -c '%u:%g' "$ODOO_DATA_DIR")" == "$ODOO_RUNTIME_UID:$ODOO_RUNTIME_GID" ]] || {
  echo "Restored Odoo data root ownership is invalid" >&2
  exit 65
}
[[ "$(stat -c '%u:%g' "$FILESTORE_ROOT")" == "$ODOO_RUNTIME_UID:$ODOO_RUNTIME_GID" ]] || {
  echo "Restored filestore root ownership is invalid" >&2
  exit 65
}
[[ "$(stat -c '%u:%g' "$FILESTORE_DB")" == "$ODOO_RUNTIME_UID:$ODOO_RUNTIME_GID" ]] || {
  echo "Restored database filestore ownership is invalid" >&2
  exit 65
}

printf 'Restored backup set %s into database %s\n' "$(jq -r '.backup_set' "$SET_DIR/manifest.json")" "$ODOO_DB_NAME"
