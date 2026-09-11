from odoo import Command
from odoo.tests import HttpCase, TransactionCase, tagged

from odoo.addons.fu_core.tests.visual_capture import capture_views, install_arabic


@tagged("post_install", "-at_install")
class TestFaresBusinessUIContracts(TransactionCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.env.user.group_ids += cls.env.ref("fu_core.group_fu_owner_admin")

    def test_business_workspace_and_readonly_quotation_views_are_registered(self):
        action = self.env.ref("fu_business.action_fu_business_clients")
        lead_form = self.env.ref("fu_business.fu_business_lead_form")
        quote_form = self.env.ref("fu_business.fu_business_sale_order_form")
        menu = self.env.ref("fu_business.menu_fu_business_clients")
        self.assertEqual(action.res_model, "crm.lead")
        self.assertEqual(lead_form.model, "crm.lead")
        self.assertEqual(quote_form.model, "sale.order")
        self.assertEqual(menu.action, action)


@tagged("post_install", "-at_install")
class TestFaresBusinessBilingualUI(HttpCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.admin = cls.env.ref("base.user_admin")
        cls.admin.write(
            {"group_ids": [Command.link(cls.env.ref("fu_core.group_fu_owner_admin").id)]}
        )
        cls.partner = cls.env["res.partner"].create(
            {
                "name": "Phase 3B Hosted Business Client",
                "company_type": "company",
            }
        )
        cls.lead = cls.env["crm.lead"].with_user(cls.admin).create(
            {
                "name": "Phase 3B Hosted Uniform Enquiry",
                "fu_business_client": True,
                "partner_id": cls.partner.id,
                "partner_name": cls.partner.name,
                "contact_name": "Hosted Procurement Contact",
                "fu_design_requirements": "Hosted bilingual design brief",
            }
        )

    def _set_language(self, arabic):
        if arabic:
            install_arabic(self.env, self.admin)
        else:
            self.admin.lang = "en_US"

    def _lead_action(self):
        return self.env["ir.actions.act_window"].create(
            {
                "name": "Hosted Phase 3B business UI",
                "res_model": "crm.lead",
                "view_mode": "form",
                "view_id": self.env.ref("fu_business.fu_business_lead_form").id,
                "res_id": self.lead.id,
                "target": "current",
            }
        )

    def _show_lead(self, arabic=False):
        self._set_language(arabic)
        action = self._lead_action()
        expected_start = "بدء تجهيز العينة" if arabic else "Start Sample"
        expected_design = "متطلبات التصميم" if arabic else "Design requirements"
        expected_gate = (
            "يظل تأكيد الطلب التجاري" if arabic else "Commercial confirmation, payment, shipment and cancellation remain policy-gated"
        )
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
                const start = await waitFor('button[name="action_fu_prepare_sample"]');
                if (!start.innerText.includes({expected_start!r})) throw new Error('Localized Start Sample action missing');
                if (!form.innerText.includes({expected_design!r})) throw new Error('Localized design requirements context missing');
                if (!form.innerText.includes({expected_gate!r})) throw new Error('Policy-gate warning missing');
                start.focus();
                if (document.activeElement !== start) throw new Error('Business workflow action cannot receive keyboard focus');
                if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 2) throw new Error('Business form has horizontal viewport overflow');
                {"if (getComputedStyle(form).direction !== 'rtl') throw new Error('Arabic business form is not rendered RTL');" if arabic else ""}
                console.log('test successful');
            }})();
        """
        with capture_views("business_clients_ar" if arabic else "business_clients_en", rtl=arabic):
            self.browser_js(
                f"/odoo/action-{action.id}",
                code,
                ready="!!document.querySelector('.o_form_view')",
                login="admin",
                timeout=60,
            )

    def test_business_clients_english(self):
        self._show_lead()

    def test_business_clients_arabic_rtl(self):
        self._show_lead(arabic=True)
