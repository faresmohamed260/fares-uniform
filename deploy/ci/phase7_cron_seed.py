from datetime import timedelta

from odoo import fields


CRON_PARAMETER = "fares.phase7.vercel_cron_id"
MARKER_NAME = "phase7-cron-execution-marker.txt"
MARKER_BYTES = b"fares-uniform-phase7-cron-marker-v1\n"

params = env["ir.config_parameter"].sudo()
params.set_param("ir_attachment.location", "db")

crons = env["ir.cron"].sudo()
crons.search([]).write({"active": False})

env["ir.attachment"].sudo().search([("name", "=", MARKER_NAME)]).unlink()

code = """
env.cr.execute("SELECT pg_sleep(2)")
env["ir.attachment"].sudo().create({
    "name": "phase7-cron-execution-marker.txt",
    "type": "binary",
    "raw": b"fares-uniform-phase7-cron-marker-v1\\n",
    "mimetype": "text/plain",
})
"""

cron = crons.create(
    {
        "name": "Phase 7 Vercel external cron proof",
        "user_id": env.ref("base.user_root").id,
        "active": True,
        "interval_number": 1,
        "interval_type": "days",
        "nextcall": fields.Datetime.now() - timedelta(minutes=1),
        "model_id": env["ir.model"]._get_id("ir.attachment"),
        "state": "code",
        "code": code,
    }
)
params.set_param(CRON_PARAMETER, str(cron.id))
env.cr.commit()

assert cron.active
assert cron.nextcall <= fields.Datetime.now()
print(f"PHASE7_CRON_SEED_OK cron_id={cron.id} due=true")
