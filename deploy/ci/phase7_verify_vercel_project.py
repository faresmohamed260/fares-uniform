#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
config = json.loads((ROOT / "vercel.json").read_text(encoding="utf-8"))

assert config.get("$schema") == "https://openapi.vercel.sh/vercel.json"
assert "env" not in config, "Project-wide inline env must not carry service-local runtime mode or secrets"

services = config.get("services")
assert isinstance(services, dict)
assert set(services) == {"public_web", "odoo_http", "odoo_websocket"}

public = services["public_web"]
assert public.get("root") == "apps/public-web/"
assert public.get("framework") == "nextjs"
assert public.get("bindings") == [
    {
        "type": "service",
        "service": "odoo_http",
        "format": "url",
        "env": "ODOO_BASE_URL",
    }
]

http = services["odoo_http"]
assert http == {
    "root": ".",
    "runtime": "container",
    "entrypoint": "Dockerfile.vercel",
}

websocket = services["odoo_websocket"]
assert websocket.get("root") == "."
assert websocket.get("runtime") == "container"
assert websocket.get("entrypoint") == "Dockerfile.vercel"
assert websocket.get("bindings") == [
    {
        "type": "service",
        "service": "odoo_http",
        "format": "url",
        "env": "FARES_ODOO_HTTP_INTERNAL_URL",
    }
]

rewrites = config.get("rewrites")
assert rewrites == [
    {
        "source": "/websocket",
        "destination": {"service": "odoo_websocket"},
    },
    {
        "source": "/fares/internal/cron/run",
        "destination": {"service": "odoo_http"},
    },
    {
        "source": "/(.*)",
        "destination": {"service": "public_web"},
    },
]

# The public Odoo API is consumed through public_web's private service binding;
# do not create a second direct Internet exposure for it or broad Odoo routes.
for rewrite in rewrites:
    source = rewrite["source"]
    target = rewrite["destination"]["service"]
    assert not source.startswith("/fu/public"), "Public Odoo API must remain behind the Next.js service"
    if target == "odoo_http":
        assert source == "/fares/internal/cron/run", "Only the authenticated cron trigger may expose Odoo HTTP"
    if target == "odoo_websocket":
        assert source == "/websocket", "Only the browser-required WebSocket route may expose evented Odoo"

serialized = json.dumps(config, sort_keys=True)
for forbidden in (
    "ODOO_DB_PASSWORD",
    "ODOO_ADMIN_PASSWD",
    "CRON_SECRET",
    "POSTGRES_PASSWORD",
    "SUPABASE_DB_PASSWORD",
    "6543",
):
    assert forbidden not in serialized, f"Forbidden secret/transaction-pool marker committed in vercel.json: {forbidden}"

print("PHASE7_VERCEL_PROJECT_OK services=3")
print("public_web_to_odoo_http=private_binding")
print("odoo_http_public_routes=/fares/internal/cron/run")
print("odoo_websocket_public_routes=/websocket")
print("odoo_backoffice_public=false")
print("project_inline_env=false")
