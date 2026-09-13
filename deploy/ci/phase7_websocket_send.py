import os


channel = os.environ["PHASE7_WS_CHANNEL"]
marker = os.environ["PHASE7_NOTIFICATION_MARKER"]

env["bus.bus"]._sendone(
    channel,
    "phase7_websocket_marker",
    {"marker": marker},
)
env.cr.commit()
print(f"PHASE7_WEBSOCKET_SEND_OK marker={marker}")
