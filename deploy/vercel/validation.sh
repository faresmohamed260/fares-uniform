#!/usr/bin/env bash

# Shared validation helpers for the stateless Vercel Odoo entrypoint.
# Keep these side-effect free so hosted CI can exercise the exact production
# validation rules without starting Odoo or connecting to PostgreSQL.

fares_require_identifier() {
  local name="$1"
  local value="${!name:-}"
  [[ "$value" =~ ^[A-Za-z0-9_]+$ ]] || {
    echo "$name must match [A-Za-z0-9_]+" >&2
    return 64
  }
}

fares_require_db_connection_user() {
  local name="$1"
  local value="${!name:-}"

  # Direct PostgreSQL uses the bare role (for example `fares_app`). Supavisor
  # shared/session pooler authentication appends exactly one project-ref suffix
  # (for example `fares_app.urqlxisivowkmsfisjek`). Do not broaden this to an
  # arbitrary libpq string: Odoo passes the value as a username, not a DSN.
  [[ "$value" =~ ^[A-Za-z0-9_]+(\.[A-Za-z0-9]+)?$ ]] || {
    echo "$name must be a PostgreSQL identifier optionally followed by one .<project-ref> suffix" >&2
    return 64
  }
}
