MARKER_KEY = "fares.phase7.vercel_restore_marker"
MARKER_VALUE = "phase7-db-only-marker-v1"
ATTACHMENT_NAME = "phase7-db-attachment-marker.txt"
ATTACHMENT_BYTES = b"fares-uniform-phase7-db-attachment-marker-v1\n"

params = env["ir.config_parameter"].sudo()
assert params.get_param("ir_attachment.location") == "db", "attachment storage is not database-backed"
assert params.get_param(MARKER_KEY) == MARKER_VALUE, "database marker mismatch"

attachment = env["ir.attachment"].sudo().search([("name", "=", ATTACHMENT_NAME)], limit=1)
assert attachment, "database-backed fixture attachment is missing"
assert not attachment.store_fname, "restored attachment unexpectedly points at local filestore"
assert attachment.db_datas, "restored attachment has no database binary content"
assert attachment.raw == ATTACHMENT_BYTES, "restored attachment content mismatch"

env.cr.execute("SELECT count(*) FROM fares_http_session")
session_rows = env.cr.fetchone()[0]
assert session_rows > 0, "shared PostgreSQL session store has no session rows"

print(f"PHASE7_STATE_OK attachment_id={attachment.id} session_rows={session_rows} storage=db")
