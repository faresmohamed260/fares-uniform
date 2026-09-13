import os

from odoo import fields


CRON_PARAMETER = "fares.phase7.vercel_cron_id"
MARKER_NAME = "phase7-cron-execution-marker.txt"
MARKER_BYTES = b"fares-uniform-phase7-cron-marker-v1\n"

expected = int(os.environ.get("PHASE7_EXPECTED_CRON_EXECUTIONS", "1"))
assert expected in (0, 1), "Phase 7 cron proof supports only expected counts 0 or 1"

params = env["ir.config_parameter"].sudo()
cron_id = int(params.get_param(CRON_PARAMETER) or 0)
assert cron_id, "Phase 7 cron fixture id is missing"
cron = env["ir.cron"].sudo().browse(cron_id).exists()
assert cron, "Phase 7 cron fixture record is missing"

markers = env["ir.attachment"].sudo().search([("name", "=", MARKER_NAME)])
assert len(markers) == expected, (
    f"Expected {expected} cron execution marker(s), found {len(markers)}"
)

for marker in markers:
    assert not marker.store_fname, "Cron marker unexpectedly used local filestore"
    assert marker.db_datas, "Cron marker has no database-backed content"
    assert marker.raw == MARKER_BYTES, "Cron marker content mismatch"

now = fields.Datetime.now()
if expected == 0:
    assert cron.active, "Synthetic cron became inactive before external trigger"
    assert cron.nextcall <= now, "Synthetic cron stopped being due before external trigger"
else:
    assert cron.lastcall, "Externally triggered cron did not record lastcall"
    assert cron.nextcall > now, "Externally triggered cron was not rescheduled"

print(
    f"PHASE7_CRON_VERIFY_OK expected={expected} markers={len(markers)} "
    f"cron_id={cron.id}"
)
