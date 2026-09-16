#!/usr/bin/env bash

fares_resolve_odoo_runtime_mode() {
  if [[ -n "${ODOO_RUNTIME_MODE:-}" ]]; then
    printf '%s\n' "$ODOO_RUNTIME_MODE"
    return 0
  fi

  if [[ "${VERCEL:-}" == "1" && -n "${FARES_ODOO_HTTP_INTERNAL_URL:-}" ]]; then
    printf '%s\n' websocket
    return 0
  fi

  printf '%s\n' http
}
