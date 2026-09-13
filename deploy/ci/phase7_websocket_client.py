import json
import os
import sys

import websocket


url = os.environ["PHASE7_WS_URL"]
session_id = os.environ["PHASE7_SESSION_ID"]
channel = os.environ["PHASE7_WS_CHANNEL"]
expected_marker = os.environ["PHASE7_EXPECT_MARKER"]
last = int(os.environ.get("PHASE7_LAST_NOTIFICATION_ID", "0"))
timeout = float(os.environ.get("PHASE7_WS_TIMEOUT", "15"))

ws = websocket.create_connection(
    url,
    cookie=f"session_id={session_id}",
    timeout=timeout,
)
try:
    ws.send(
        json.dumps(
            {
                "event_name": "subscribe",
                "data": {"channels": [channel], "last": last},
            },
            separators=(",", ":"),
        )
    )

    while True:
        raw = ws.recv()
        if isinstance(raw, bytes):
            raw = raw.decode("utf-8")
        notifications = json.loads(raw)
        if not isinstance(notifications, list):
            continue
        for notification in notifications:
            message = notification.get("message") or {}
            if message.get("type") != "phase7_websocket_marker":
                continue
            payload = message.get("payload") or {}
            marker = payload.get("marker")
            if marker != expected_marker:
                raise AssertionError(
                    f"Unexpected Phase 7 websocket marker {marker!r}; expected {expected_marker!r}"
                )
            notification_id = int(notification["id"])
            if notification_id <= last:
                raise AssertionError(
                    f"Notification id {notification_id} did not advance beyond last={last}"
                )
            print(
                f"PHASE7_WEBSOCKET_NOTIFICATION_OK marker={marker} "
                f"notification_id={notification_id} previous_last={last}",
                flush=True,
            )
            sys.exit(0)
finally:
    ws.close()
