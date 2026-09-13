import functools
import logging
import os
import re
from datetime import datetime, timedelta, timezone

import psycopg2
from psycopg2.extras import Json

from odoo import http
from odoo.tools._vendor import sessions


_logger = logging.getLogger(__name__)
_IDENTIFIER_LENGTH = http.STORED_SESSION_BYTES
_IDENTIFIER_RE = re.compile(rf"^[A-Za-z0-9_-]{{{_IDENTIFIER_LENGTH}}}$")
_SESSION_TABLE = "public.fares_http_session"


class PostgresSessionStore(http.FilesystemSessionStore):
    """Odoo-compatible session store backed by the configured PostgreSQL DB.

    The parent class remains useful for Odoo's session-id generation, soft/hard
    rotation and delayed old-session deletion semantics. Filesystem operations
    are replaced by SQL implementations so replaceable Vercel instances share
    one server-side session truth.

    Schema ownership deliberately lives outside application runtime. The table
    must be provisioned by the Phase 7 operations/bootstrap boundary before an
    Odoo process starts.
    """

    def __init__(self, session_class=None, renew_missing=True):
        sessions.SessionStore.__init__(self, session_class=session_class)
        self.renew_missing = renew_missing
        self._validate_schema()

    @staticmethod
    def _connection_kwargs():
        required = (
            "ODOO_DB_HOST",
            "ODOO_DB_PORT",
            "ODOO_DB_NAME",
            "ODOO_DB_USER",
            "ODOO_DB_PASSWORD",
        )
        missing = [name for name in required if not os.environ.get(name)]
        if missing:
            raise RuntimeError(f"Missing PostgreSQL session-store settings: {', '.join(missing)}")
        return {
            "host": os.environ["ODOO_DB_HOST"],
            "port": int(os.environ["ODOO_DB_PORT"]),
            "dbname": os.environ["ODOO_DB_NAME"],
            "user": os.environ["ODOO_DB_USER"],
            "password": os.environ["ODOO_DB_PASSWORD"],
            "sslmode": os.environ.get("ODOO_DB_SSLMODE", "prefer"),
            "connect_timeout": 5,
            "application_name": "fares-vercel-session-store",
        }

    def _connect(self):
        return psycopg2.connect(**self._connection_kwargs())

    def _validate_schema(self):
        with self._connect() as conn, conn.cursor() as cr:
            cr.execute("SELECT to_regclass(%s), current_user", (_SESSION_TABLE,))
            relation, current_user = cr.fetchone()
            if relation is None:
                raise RuntimeError(
                    "Shared HTTP session table is missing; run the Phase 7 "
                    "session-store bootstrap before starting Odoo"
                )
            cr.execute(
                "SELECT has_table_privilege(current_user, %s, %s)",
                (_SESSION_TABLE, "SELECT,INSERT,UPDATE,DELETE"),
            )
            if not cr.fetchone()[0]:
                raise RuntimeError(
                    f"Database role {current_user!r} lacks required DML on {_SESSION_TABLE}"
                )

    def save(self, session):
        with self._connect() as conn, conn.cursor() as cr:
            cr.execute(
                f"""
                INSERT INTO {_SESSION_TABLE} (sid, data, updated_at)
                VALUES (%s, %s, now())
                ON CONFLICT (sid) DO UPDATE
                    SET data = EXCLUDED.data,
                        updated_at = EXCLUDED.updated_at
                """,
                (session.sid, Json(dict(session))),
            )

    def delete(self, session):
        with self._connect() as conn, conn.cursor() as cr:
            cr.execute(f"DELETE FROM {_SESSION_TABLE} WHERE sid = %s", (session.sid,))

    def get(self, sid):
        if not self.is_valid_key(sid):
            return self.new()
        with self._connect() as conn, conn.cursor() as cr:
            cr.execute(f"SELECT data FROM {_SESSION_TABLE} WHERE sid = %s", (sid,))
            row = cr.fetchone()
        if row is None:
            if self.renew_missing:
                return self.new()
            data = {}
        else:
            data = row[0] or {}
        return self.session_class(data, sid, False)

    def vacuum(self, max_lifetime=http.SESSION_LIFETIME):
        threshold = datetime.now(timezone.utc) - timedelta(seconds=max_lifetime)
        with self._connect() as conn, conn.cursor() as cr:
            cr.execute(f"DELETE FROM {_SESSION_TABLE} WHERE updated_at < %s", (threshold,))

    @staticmethod
    def _validated_identifiers(identifiers):
        values = list(identifiers)
        for identifier in values:
            if not _IDENTIFIER_RE.fullmatch(identifier):
                raise ValueError("Identifier format incorrect, expected Odoo session identifier prefixes")
        return values

    def get_missing_session_identifiers(self, identifiers):
        identifiers = set(self._validated_identifiers(identifiers))
        if not identifiers:
            return set()
        with self._connect() as conn, conn.cursor() as cr:
            cr.execute(
                f"""
                SELECT DISTINCT left(sid, %s)
                  FROM {_SESSION_TABLE}
                 WHERE left(sid, %s) = ANY(%s)
                """,
                (_IDENTIFIER_LENGTH, _IDENTIFIER_LENGTH, list(identifiers)),
            )
            present = {row[0] for row in cr.fetchall()}
        return identifiers - present

    def delete_from_identifiers(self, identifiers):
        identifiers = self._validated_identifiers(identifiers)
        if not identifiers:
            return
        with self._connect() as conn, conn.cursor() as cr:
            cr.execute(
                f"""
                DELETE FROM {_SESSION_TABLE}
                 WHERE left(sid, %s) = ANY(%s)
                """,
                (_IDENTIFIER_LENGTH, identifiers),
            )


def _postgres_session_store(_application):
    _logger.info("HTTP sessions stored in PostgreSQL for stateless runtime")
    return PostgresSessionStore(session_class=http.Session, renew_missing=True)


def post_load():
    if os.environ.get("FARES_SESSION_STORE", "").strip().lower() != "postgres":
        return
    if getattr(http.Application, "_fares_postgres_session_store_installed", False):
        return

    descriptor = functools.cached_property(_postgres_session_store)
    descriptor.__set_name__(http.Application, "session_store")
    http.Application.session_store = descriptor
    http.Application._fares_postgres_session_store_installed = True
    http.root.__dict__.pop("session_store", None)
    _logger.info("Installed Fares PostgreSQL-backed Odoo session store")
