import os
from pathlib import Path

root = Path("evidence")
root.mkdir(exist_ok=True)
log = (root / "odoo.log").read_text(errors="replace") if (root / "odoo.log").exists() else ""
lines = [line for line in log.splitlines() if "Starting Test" in line or "tests passed" in line or "failed" in line.lower() or "ERROR" in line]
text = "# Odoo proof execution\n\nCommit: " + os.environ.get("GITHUB_SHA", "unknown") + "\n\n"
text += "Runtime/test evidence only. No client visual approval or production readiness is implied.\n\n"
text += "\n".join("- " + line for line in lines[-100:]) or "No test evidence available."
text += "\n\nPending: real network isolation and multi-hour/device-loss tests; visual inspection/client acceptance; integrated financial/stock collection policy.\n"
(root / "summary.md").write_text(text)

# Emit small synthetic-only previews so the remote reviewer can inspect them
# directly through Actions logs without downloading project files locally.
import base64
import io
from PIL import Image
for path in sorted(root.rglob("*.png")):
    if path.name.startswith(("pos_en_", "pos_ar_", "task_en_", "task_ar_")):
        with Image.open(path) as source:
            source.thumbnail((1200, 900))
            output = io.BytesIO()
            source.convert("RGB").save(output, format="JPEG", quality=70)
        print("FU_IMAGE " + path.name + " " + base64.b64encode(output.getvalue()).decode("ascii"))
