#!/usr/bin/env bash
set -euo pipefail

: "${ODOO_DB_HOST:=db}"
: "${ODOO_DB_PORT:=5432}"
: "${ODOO_DB_NAME:=fares}"
: "${ODOO_DB_USER:=fares_app}"
: "${ODOO_DB_PASSWORD_FILE:?ODOO_DB_PASSWORD_FILE is required}"
: "${ODOO_DATA_DIR:=/var/lib/odoo}"
: "${BACKUP_ROOT:=/backups}"
: "${FARES_SHA:?FARES_SHA is required}"
: "${ODOO_SHA:?ODOO_SHA is required}"

[[ "$ODOO_DB_NAME" =~ ^[A-Za-z0-9_]+$ ]] || { echo "Invalid ODOO_DB_NAME" >&2; exit 64; }
[[ -r "$ODOO_DB_PASSWORD_FILE" ]] || { echo "Database password file is not readable" >&2; exit 64; }
[[ "$FARES_SHA" =~ ^[0-9a-f]{40}$ ]] || { echo "FARES_SHA must be a full Git SHA" >&2; exit 64; }
[[ "$ODOO_SHA" =~ ^[0-9a-f]{40}$ ]] || { echo "ODOO_SHA must be a full Git SHA" >&2; exit 64; }

export PGPASSWORD="$(<"$ODOO_DB_PASSWORD_FILE")"
[[ -n "$PGPASSWORD" ]] || { echo "Database password is empty" >&2; exit 64; }

FILESTORE_ROOT="${ODOO_DATA_DIR}/filestore"
FILESTORE_DB="${FILESTORE_ROOT}/${ODOO_DB_NAME}"
[[ -d "$FILESTORE_DB" ]] || { echo "Filestore not found: $FILESTORE_DB" >&2; exit 66; }

TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_SET="${TIMESTAMP}-${FARES_SHA:0:12}"
DEST="${BACKUP_ROOT}/${BACKUP_SET}"
mkdir -p "$DEST"

pg_dump \
  --host="$ODOO_DB_HOST" \
  --port="$ODOO_DB_PORT" \
  --username="$ODOO_DB_USER" \
  --dbname="$ODOO_DB_NAME" \
  --format=custom \
  --no-owner \
  --no-acl \
  --file="$DEST/database.dump"

tar -C "$FILESTORE_ROOT" -czf "$DEST/filestore.tar.gz" "$ODOO_DB_NAME"

jq -n \
  --arg backup_set "$BACKUP_SET" \
  --arg created_at "$TIMESTAMP" \
  --arg fares_sha "$FARES_SHA" \
  --arg odoo_sha "$ODOO_SHA" \
  --arg database "$ODOO_DB_NAME" \
  --arg postgres_version "$(pg_dump --version | head -n1)" \
  '{
    format_version: 1,
    backup_set: $backup_set,
    created_at_utc: $created_at,
    fares_sha: $fares_sha,
    odoo_sha: $odoo_sha,
    database: $database,
    components: ["database.dump", "filestore.tar.gz"],
    postgres_client: $postgres_version
  }' > "$DEST/manifest.json"

(
  cd "$DEST"
  sha256sum database.dump filestore.tar.gz manifest.json > checksums.sha256
)

printf '%s\n' "$BACKUP_SET" > "${BACKUP_ROOT}/LATEST"
printf 'Created backup set %s\n' "$BACKUP_SET"
