#!/usr/bin/env bash
set -euo pipefail

read_secret() {
  local value_var="$1"
  local file_var="$2"
  local current="${!value_var:-}"
  local file_path="${!file_var:-}"
  if [[ -n "$file_path" ]]; then
    [[ -r "$file_path" ]] || { echo "Secret file not readable: $file_var" >&2; exit 64; }
    current="$(<"$file_path")"
  fi
  [[ -n "$current" ]] || { echo "Required secret is empty: $value_var/$file_var" >&2; exit 64; }
  [[ "$current" != *$'\n'* && "$current" != *$'\r'* ]] || { echo "Secret contains a newline: $value_var" >&2; exit 64; }
  printf -v "$value_var" '%s' "$current"
}

require_identifier() {
  local name="$1"
  local value="${!name:-}"
  [[ "$value" =~ ^[A-Za-z0-9_]+$ ]] || { echo "$name must match [A-Za-z0-9_]+" >&2; exit 64; }
}

: "${ODOO_DB_HOST:=db}"
: "${ODOO_DB_PORT:=5432}"
: "${ODOO_DB_NAME:=fares}"
: "${ODOO_DB_USER:=fares_app}"
: "${ODOO_WORKERS:=2}"
: "${ODOO_MAX_CRON_THREADS:=1}"
: "${ODOO_DB_MAXCONN:=32}"
: "${ODOO_LIMIT_MEMORY_SOFT:=1073741824}"
: "${ODOO_LIMIT_MEMORY_HARD:=1342177280}"
: "${ODOO_LIMIT_TIME_CPU:=120}"
: "${ODOO_LIMIT_TIME_REAL:=240}"
: "${ODOO_LIMIT_TIME_REAL_CRON:=600}"
: "${ODOO_LOG_LEVEL:=info}"

export ODOO_DB_HOST ODOO_DB_PORT ODOO_DB_NAME ODOO_DB_USER

require_identifier ODOO_DB_NAME
require_identifier ODOO_DB_USER
[[ "$ODOO_DB_PORT" =~ ^[0-9]+$ ]] || { echo "ODOO_DB_PORT must be numeric" >&2; exit 64; }
[[ "$ODOO_WORKERS" =~ ^[0-9]+$ ]] || { echo "ODOO_WORKERS must be numeric" >&2; exit 64; }
[[ "$ODOO_MAX_CRON_THREADS" =~ ^[0-9]+$ ]] || { echo "ODOO_MAX_CRON_THREADS must be numeric" >&2; exit 64; }

read_secret ODOO_DB_PASSWORD ODOO_DB_PASSWORD_FILE
read_secret ODOO_ADMIN_PASSWD ODOO_ADMIN_PASSWD_FILE
export ODOO_DB_PASSWORD

for attempt in $(seq 1 30); do
  if /opt/odoo-venv/bin/python - <<'PY'
import os
import psycopg2
conn = psycopg2.connect(
    host=os.environ["ODOO_DB_HOST"],
    port=int(os.environ["ODOO_DB_PORT"]),
    dbname=os.environ["ODOO_DB_NAME"],
    user=os.environ["ODOO_DB_USER"],
    password=os.environ["ODOO_DB_PASSWORD"],
    connect_timeout=2,
)
conn.close()
PY
  then
    break
  fi
  if [[ "$attempt" == 30 ]]; then
    echo "Database did not become ready" >&2
    exit 69
  fi
  sleep 2
done

umask 077
ODOO_RC=/tmp/fares-odoo.conf
cat >"$ODOO_RC" <<EOF
[options]
addons_path = /mnt/extra-addons,/opt/odoo/addons
data_dir = /var/lib/odoo
admin_passwd = ${ODOO_ADMIN_PASSWD}
db_host = ${ODOO_DB_HOST}
db_port = ${ODOO_DB_PORT}
db_user = ${ODOO_DB_USER}
db_password = ${ODOO_DB_PASSWORD}
db_name = ${ODOO_DB_NAME}
dbfilter = ^${ODOO_DB_NAME}$
list_db = False
proxy_mode = True
workers = ${ODOO_WORKERS}
max_cron_threads = ${ODOO_MAX_CRON_THREADS}
db_maxconn = ${ODOO_DB_MAXCONN}
limit_memory_soft = ${ODOO_LIMIT_MEMORY_SOFT}
limit_memory_hard = ${ODOO_LIMIT_MEMORY_HARD}
limit_time_cpu = ${ODOO_LIMIT_TIME_CPU}
limit_time_real = ${ODOO_LIMIT_TIME_REAL}
limit_time_real_cron = ${ODOO_LIMIT_TIME_REAL_CRON}
http_interface = 0.0.0.0
http_port = 8069
gevent_port = 8072
log_level = ${ODOO_LOG_LEVEL}
without_demo = all
EOF
chmod 0600 "$ODOO_RC"

exec /opt/odoo-venv/bin/python /opt/odoo/odoo-bin -c "$ODOO_RC" "$@"
