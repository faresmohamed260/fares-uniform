import base64
import os

MARKER_KEY = "fares.phase7.vercel_restore_marker"
MARKER_VALUE = "phase7-db-only-marker-v1"
ATTACHMENT_NAME = "phase7-db-attachment-marker.txt"
ATTACHMENT_BYTES = b"fares-uniform-phase7-db-attachment-marker-v1\n"

login_password = os.environ.get("PHASE7_LOGIN_PASSWORD")
assert login_password, "PHASE7_LOGIN_PASSWORD is required"

params = env["ir.config_parameter"].sudo()
params.set_param("ir_attachment.location", "db")
params.set_param(MARKER_KEY, MARKER_VALUE)

env.ref("base.user_admin").sudo().write({"password": login_password})

attachments = env["ir.attachment"].sudo()
attachments.search([("name", "=", ATTACHMENT_NAME)]).unlink()
attachment = attachments.create(
    {
        "name": ATTACHMENT_NAME,
        "type": "binary",
        "datas": base64.b64encode(ATTACHMENT_BYTES),
        "mimetype": "text/plain",
    }
)
assert not attachment.store_fname, "Vercel fixture unexpectedly used local filestore"
assert attachment.db_datas, "Vercel fixture has no database-backed binary content"
assert attachment.raw == ATTACHMENT_BYTES, "Vercel fixture attachment content mismatch"

env.cr.commit()
print(f"PHASE7_SEED_OK attachment_id={attachment.id} storage=db")
