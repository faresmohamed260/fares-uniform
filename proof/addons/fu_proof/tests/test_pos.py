from unittest.mock import patch
from odoo.tests import tagged
from odoo.tests.common import ChromeBrowser
from odoo.addons.point_of_sale.tests.test_frontend import TestPointOfSaleHttpCommon


@tagged("post_install", "-at_install")
class TestProofPOS(TestPointOfSaleHttpCommon):
    def test_offline_checkout_reload_reconnect(self):
        self.start_pos_tour("fu_offline_checkout", timeout=180)
        orders = self.env["pos.order"].search([
            ("config_id", "=", self.main_pos_config.id), ("state", "=", "paid"),
        ])
        self.assertEqual(len(orders), 1, "Reconnect must create exactly one paid order")
        self.assertEqual(len(orders.payment_ids), 1)
        self.assertAlmostEqual(orders.amount_paid, orders.amount_total)

    def test_native_pos_visual(self):
        original = ChromeBrowser._wait_code_ok

        def capture(browser, *args, **kwargs):
            result = original(browser, *args, **kwargs)
            browser.take_screenshot(prefix="pos_en_desktop_").result(timeout=15)
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
            browser.take_screenshot(prefix="pos_en_narrow_reduced_").result(timeout=15)
            return result

        with patch.object(ChromeBrowser, "_wait_code_ok", capture):
            self.start_pos_tour("fu_pos_visual", timeout=120)
