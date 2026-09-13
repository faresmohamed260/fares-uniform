#!/usr/bin/env bash
set -euo pipefail

: "${FARES_DB_NAME:?FARES_DB_NAME is required}"
: "${FARES_DB_USER:?FARES_DB_USER is required}"
: "${POSTGRES_USER:=postgres}"

for name in FARES_DB_NAME FARES_DB_USER POSTGRES_USER; do
  value="${!name}"
  [[ "$value" =~ ^[A-Za-z0-9_]+$ ]] || {
    echo "$name must match [A-Za-z0-9_]+" >&2
    exit 64
  }
done

# This is an operations/bootstrap boundary, not application runtime DDL.
# The caller must authenticate as a role allowed to own infrastructure tables.
psql \
  --username="$POSTGRES_USER" \
  --dbname="$FARES_DB_NAME" \
  --set=ON_ERROR_STOP=1 \
  --set=app_user="$FARES_DB_USER" <<'SQL'
CREATE TABLE IF NOT EXISTS public.fares_http_session (
    sid varchar(84) PRIMARY KEY,
    data jsonb NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS fares_http_session_updated_at_idx
    ON public.fares_http_session (updated_at);

REVOKE ALL ON TABLE public.fares_http_session FROM PUBLIC;

SELECT format(
    'ALTER TABLE public.fares_http_session OWNER TO %I',
    current_user
)
\gexec

SELECT format(
    'REVOKE ALL ON TABLE public.fares_http_session FROM %I',
    :'app_user'
)
\gexec

SELECT format(
    'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.fares_http_session TO %I',
    :'app_user'
)
\gexec
SQL
