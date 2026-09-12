import base64
import os

MARKER_KEY = "fares.phase6.restore_marker"
MARKER_VALUE = "phase6-db-marker-v1"
ATTACHMENT_NAME = "phase6-filestore-marker.txt"
ATTACHMENT_BYTES = b"fares-uniform-phase6-filestore-marker-v1\n"

params = env["ir.config_parameter"].sudo()
assert params.get_param(MARKER_KEY) == MARKER_VALUE, "database marker was not recovered"

attachment = env["ir.attachment"].sudo().search([("name", "=", ATTACHMENT_NAME)], limit=1)
assert attachment, "filestore marker attachment is missing"
assert base64.b64decode(attachment.datas or b"") == ATTACHMENT_BYTES, "attachment bytes do not match"
assert attachment.store_fname, "restored attachment is not filestore-backed"
path = attachment._full_path(attachment.store_fname)
assert os.path.isfile(path), f"restored filestore object missing: {path}"
print(f"PHASE6_RESTORE_OK attachment_id={attachment.id} store_fname={attachment.store_fname}")
