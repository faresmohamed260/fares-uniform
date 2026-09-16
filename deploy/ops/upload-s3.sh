#!/usr/bin/env bash
set -euo pipefail

[[ $# -eq 1 ]] || { echo "usage: upload-s3.sh /backups/<set>" >&2; exit 64; }
SET_DIR="$1"

: "${S3_ENDPOINT_URL:?S3_ENDPOINT_URL is required}"
: "${S3_BUCKET:?S3_BUCKET is required}"
: "${S3_PREFIX:=fares-uniform/backups}"

/opt/fares/verify-backup.sh "$SET_DIR"
BACKUP_SET="$(jq -r '.backup_set' "$SET_DIR/manifest.json")"
DEST="s3://${S3_BUCKET}/${S3_PREFIX%/}/${BACKUP_SET}/"

aws --endpoint-url "$S3_ENDPOINT_URL" s3 cp "$SET_DIR/" "$DEST" --recursive --only-show-errors
printf 'Uploaded verified backup set %s to %s\n' "$BACKUP_SET" "$DEST"
