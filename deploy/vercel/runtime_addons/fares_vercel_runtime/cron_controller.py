import hmac
import logging
import os

from odoo import http
from odoo.addons.base.models.ir_cron import IrCron
from odoo.http import request


_logger = logging.getLogger(__name__)
_CRON_ROUTE = "/fares/internal/cron/run"
_BEARER_PREFIX = "Bearer "


def _json_response(payload, status=200):
    return request.make_json_response(
        payload,
        status=status,
        headers=[("Cache-Control", "no-store")],
    )


class FaresVercelCronController(http.Controller):
    """Sessionless Vercel Cron entrypoint for Odoo's native scheduler.

    Vercel Cron sends CRON_SECRET as an Authorization bearer credential. The
    route does not accept a caller-selected database and delegates ready-job
    acquisition to pinned Odoo's native IrCron implementation, which uses
    PostgreSQL row locking/SKIP LOCKED to avoid duplicate concurrent execution.
    """

    @http.route(
        _CRON_ROUTE,
        type="http",
        auth="none",
        methods=["GET"],
        save_session=False,
    )
    def run_ready_crons(self, **_kwargs):
        expected = os.environ.get("CRON_SECRET", "")
        if not expected:
            _logger.error("Vercel cron trigger disabled because CRON_SECRET is not configured")
            return _json_response({"status": "disabled"}, status=503)

        authorization = request.httprequest.headers.get("Authorization", "")
        if not authorization.startswith(_BEARER_PREFIX):
            return _json_response({"status": "unauthorized"}, status=401)

        supplied = authorization[len(_BEARER_PREFIX):]
        if not supplied or not hmac.compare_digest(supplied, expected):
            return _json_response({"status": "unauthorized"}, status=401)

        db_name = os.environ.get("ODOO_DB_NAME", "")
        if not db_name:
            _logger.error("Vercel cron trigger disabled because ODOO_DB_NAME is not configured")
            return _json_response({"status": "disabled"}, status=503)

        try:
            IrCron._process_jobs(db_name)
        except Exception:  # noqa: BLE001 - HTTP boundary must fail closed without leaking details.
            _logger.exception("Vercel-triggered Odoo cron processing failed")
            return _json_response({"status": "error"}, status=500)

        return _json_response({"status": "ok"})
