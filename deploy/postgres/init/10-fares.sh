#!/usr/bin/env bash
set -euo pipefail

: "${POSTGRES_USER:=postgres}"
: "${POSTGRES_DB:=postgres}"
: "${FARES_DB_NAME:?FARES_DB_NAME is required}"
: "${FARES_DB_USER:?FARES_DB_USER is required}"
: "${FARES_DB_PASSWORD_FILE:?FARES_DB_PASSWORD_FILE is required}"

[[ "$FARES_DB_NAME" =~ ^[A-Za-z0-9_]+$ ]] || { echo "Invalid FARES_DB_NAME" >&2; exit 64; }
[[ "$FARES_DB_USER" =~ ^[A-Za-z0-9_]+$ ]] || { echo "Invalid FARES_DB_USER" >&2; exit 64; }
[[ -r "$FARES_DB_PASSWORD_FILE" ]] || { echo "Database password file is not readable" >&2; exit 64; }
FARES_DB_PASSWORD="$(<"$FARES_DB_PASSWORD_FILE")"
[[ -n "$FARES_DB_PASSWORD" && "$FARES_DB_PASSWORD" != *$'\n'* && "$FARES_DB_PASSWORD" != *$'\r'* ]] || {
  echo "Invalid database password" >&2
  exit 64
}

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  --set=app_user="$FARES_DB_USER" \
  --set=app_password="$FARES_DB_PASSWORD" \
  --set=app_db="$FARES_DB_NAME" <<'SQL'
SELECT format(
  'CREATE ROLE %I LOGIN PASSWORD %L NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION',
  :'app_user', :'app_password'
)
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'app_user')
\gexec

SELECT format(
  'CREATE DATABASE %I WITH OWNER %I ENCODING %L TEMPLATE template0',
  :'app_db', current_user, 'UTF8'
)
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = :'app_db')
\gexec
SQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$FARES_DB_NAME" \
  --set=app_user="$FARES_DB_USER" \
  --set=app_db="$FARES_DB_NAME" <<'SQL'
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
SELECT format('GRANT CONNECT, TEMPORARY ON DATABASE %I TO %I', :'app_db', :'app_user') \gexec
SELECT format('GRANT USAGE, CREATE ON SCHEMA public TO %I', :'app_user') \gexec
SQL
