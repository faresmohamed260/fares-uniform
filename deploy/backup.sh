#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${ENV_FILE:-${ROOT_DIR}/.env}"
COMPOSE_FILE="${COMPOSE_FILE:-${ROOT_DIR}/compose.yml}"

[[ -f "$ENV_FILE" ]] || { echo "Runtime env file not found: $ENV_FILE" >&2; exit 66; }
DC=(docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE")

restart_odoo() {
  "${DC[@]}" start odoo >/dev/null 2>&1 || true
}
trap restart_odoo EXIT

"${DC[@]}" stop odoo
"${DC[@]}" --profile ops run --rm ops /opt/fares/backup-set.sh
restart_odoo
trap - EXIT

printf 'Backup complete. Latest set: '
cat "${ROOT_DIR}/.runtime/backups/LATEST"
