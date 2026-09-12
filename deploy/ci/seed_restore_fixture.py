import base64
import os

MARKER_KEY = "fares.phase6.restore_marker"
MARKER_VALUE = "phase6-db-marker-v1"
ATTACHMENT_NAME = "phase6-filestore-marker.txt"
ATTACHMENT_BYTES = b"fares-uniform-phase6-filestore-marker-v1\n"

params = env["ir.config_parameter"].sudo()
params.set_param(MARKER_KEY, MARKER_VALUE)

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
assert attachment.store_fname, "fixture attachment did not use the filestore"
path = attachment._full_path(attachment.store_fname)
assert os.path.isfile(path), f"filestore object missing: {path}"
env.cr.commit()
print(f"PHASE6_SEED_OK attachment_id={attachment.id} store_fname={attachment.store_fname}")
