import os
from pathlib import Path

root = Path("evidence")
root.mkdir(exist_ok=True)
log = (root / "odoo.log").read_text(errors="replace") if (root / "odoo.log").exists() else ""
lines = [line for line in log.splitlines() if "Starting Test" in line or "tests passed" in line or "failed" in line.lower() or "ERROR" in line]
text = "# Odoo proof execution\n\nCommit: " + os.environ.get("GITHUB_SHA", "unknown") + "\n\n"
text += "Runtime/test evidence only. No client visual approval or production readiness is implied.\n\n"
text += "\n".join("- " + line for line in lines[-100:]) or "No test evidence available."
text += "\n\nPending: true offline network/reload experiment, visual RTL/reduced-motion review, integrated financial/stock collection policy, multi-hour/device-loss tests.\n"
(root / "summary.md").write_text(text)
