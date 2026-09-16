#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${ENV_FILE:-${ROOT_DIR}/.env}"
COMPOSE_FILE="${COMPOSE_FILE:-${ROOT_DIR}/compose.yml}"
PRODUCTION_ADDONS="fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api,fu_reporting"

[[ -f "$ENV_FILE" ]] || { echo "Runtime env file not found: $ENV_FILE" >&2; exit 66; }
DC=(docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE")

"${DC[@]}" up -d db
"${DC[@]}" run --rm odoo --stop-after-init -i "$PRODUCTION_ADDONS"
"${DC[@]}" run --rm odoo --stop-after-init -u "$PRODUCTION_ADDONS"
"${DC[@]}" up -d odoo proxy
"${DC[@]}" ps
