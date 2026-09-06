from contextlib import contextmanager
from unittest.mock import patch
from odoo.tests.common import ChromeBrowser


@contextmanager
def capture_views(prefix, rtl=False, pos=False):
    original = ChromeBrowser._wait_code_ok

    def capture(browser, *args, **kwargs):
        result = original(browser, *args, **kwargs)
        if rtl:
            is_rtl = browser._websocket_request("Runtime.evaluate", params={
                "expression": "document.body.classList.contains('o_rtl')",
            })["result"].get("value")
            if not is_rtl:
                raise AssertionError("Arabic page did not render Odoo RTL mode")
        browser.take_screenshot(prefix=prefix + "_desktop_").result(timeout=15)
        browser._websocket_request("Emulation.setDeviceMetricsOverride", params={
            "width": 390, "height": 844, "deviceScaleFactor": 1, "mobile": True,
        })
        browser._websocket_request("Emulation.setEmulatedMedia", params={
            "features": [{"name": "prefers-reduced-motion", "value": "reduce"}],
        })
        browser._websocket_request("Runtime.evaluate", params={
            "expression": "new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))",
            "awaitPromise": True,
        })
        if pos:
            reduced = browser._websocket_request("Runtime.evaluate", params={
                "expression": "matchMedia('(prefers-reduced-motion: reduce)').matches && parseFloat(getComputedStyle(document.querySelector('.product')).transitionDuration) < 0.01",
            })["result"].get("value")
            if not reduced:
                raise AssertionError("POS motion preference not respected")
        browser.take_screenshot(prefix=prefix + "_narrow_reduced_").result(timeout=15)
        return result

    with patch.object(ChromeBrowser, "_wait_code_ok", capture):
        yield


def install_arabic(env, user):
    language = env["res.lang"].with_context(active_test=False).search([("code", "=", "ar_001")], limit=1)
    if not language:
        raise AssertionError("Arabic language missing")
    env["base.language.install"].create({"lang_ids": [(6, 0, language.ids)]}).lang_install()
    user.lang = "ar_001"
