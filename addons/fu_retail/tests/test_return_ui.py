from odoo import Command
from odoo.tests import HttpCase, TransactionCase, tagged

from odoo.addons.fu_core.tests.visual_capture import capture_views, install_arabic


@tagged("post_install", "-at_install")
class TestFaresReturnUIContracts(TransactionCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.env.user.group_ids += cls.env.ref("fu_core.group_fu_owner_admin")

    def test_return_workspace_is_registered_and_draft_source_fields_are_selectable(self):
        action = self.env.ref("fu_retail.action_fu_retail_return_requests")
        form = self.env.ref("fu_retail.fu_retail_return_request_form")
        menu = self.env.ref("fu_retail.menu_fu_retail_returns")
        self.assertEqual(action.res_model, "fu.retail.return.request")
        self.assertEqual(menu.action, action)
        self.assertEqual(form.model, "fu.retail.return.request")
        self.assertFalse(self.env["fu.retail.return.request"]._fields["source_order_id"].readonly)
        self.assertFalse(self.env["fu.retail.return.line"]._fields["source_line_id"].readonly)
        self.assertIn("exchange_difference_preview", self.env["fu.retail.return.request"]._fields)


@tagged("post_install", "-at_install")
class TestFaresReturnBilingualUI(HttpCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.admin = cls.env.ref("base.user_admin")
        cls.admin.write(
            {"group_ids": [Command.link(cls.env.ref("fu_core.group_fu_owner_admin").id)]}
        )

    def _set_language(self, arabic):
        if arabic:
            install_arabic(self.env, self.admin)
        else:
            self.admin.lang = "en_US"

    def _new_return_action(self):
        return self.env["ir.actions.act_window"].create(
            {
                "name": "Hosted Phase 2C return UI",
                "res_model": "fu.retail.return.request",
                "view_mode": "form",
                "view_id": self.env.ref("fu_retail.fu_retail_return_request_form").id,
                "target": "current",
                "context": "{'default_operation': 'exchange'}",
            }
        )

    def _show_return_form(self, arabic=False):
        self._set_language(arabic)
        action = self._new_return_action()
        expected_submit = "إرسال الطلب" if arabic else "Submit Request"
        expected_items = "الأصناف المرتجعة" if arabic else "Returned Items"
        code = f"""
            (async () => {{
                const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
                const waitFor = async (selector) => {{
                    for (let i = 0; i < 120; i++) {{
                        const node = document.querySelector(selector);
                        if (node) return node;
                        await sleep(50);
                    }}
                    throw new Error('Timed out waiting for ' + selector);
                }};
                const form = await waitFor('.o_form_view');
                const submit = await waitFor('button[name="action_submit"]');
                if (!submit.innerText.includes({expected_submit!r})) throw new Error('Localized return submit action missing');
                if (!form.innerText.includes({expected_items!r})) throw new Error('Localized returned-items context missing');
                const banner = form.querySelector('.fu-return-online-required-banner');
                if (!banner) throw new Error('Return online-required banner missing');
                window.dispatchEvent(new Event('offline'));
                await sleep(100);
                if (!submit.disabled || banner.dataset.fuOnlineState !== 'offline') throw new Error('Return workflow did not fail closed offline');
                window.dispatchEvent(new Event('online'));
                await sleep(100);
                if (submit.disabled || banner.dataset.fuOnlineState !== 'online') throw new Error('Return workflow did not recover online');
                submit.focus();
                if (document.activeElement !== submit) throw new Error('Return action cannot receive keyboard focus');
                {"if (getComputedStyle(form).direction !== 'rtl') throw new Error('Arabic return form is not rendered RTL');" if arabic else ""}
                console.log('test successful');
            }})();
        """
        with capture_views("returns_exchange_ar" if arabic else "returns_exchange_en", rtl=arabic):
            self.browser_js(
                f"/odoo/action-{action.id}",
                code,
                ready="!!document.querySelector('.o_form_view')",
                login="admin",
                timeout=60,
            )

    def test_returns_exchange_english_online_guard(self):
        self._show_return_form()

    def test_returns_exchange_arabic_rtl_online_guard(self):
        self._show_return_form(arabic=True)
