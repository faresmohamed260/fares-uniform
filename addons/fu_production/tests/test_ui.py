from datetime import timedelta

from odoo import Command, fields
from odoo.tests import HttpCase, TransactionCase, tagged

from odoo.addons.fu_core.tests.visual_capture import capture_views, install_arabic


@tagged("post_install", "-at_install")
class TestFaresProductionUIContracts(TransactionCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.env.user.group_ids += cls.env.ref("fu_core.group_fu_owner_admin")

    def test_production_workspace_and_settings_are_registered(self):
        action = self.env.ref("fu_production.action_fu_production_tasks")
        form = self.env.ref("fu_production.fu_production_task_form")
        menu = self.env.ref("fu_production.menu_fu_production")
        config_action = self.env.ref("fu_production.action_fu_production_config")
        self.assertEqual(action.res_model, "fu.production.task")
        self.assertEqual(menu.action, action)
        self.assertEqual(form.model, "fu.production.task")
        self.assertEqual(config_action.res_model, "fu.production.config")
        self.assertEqual(
            self.env["fu.production.config"]._fields["lead_time_days"].default(self.env["fu.production.config"]),
            7,
        )


@tagged("post_install", "-at_install")
class TestFaresProductionBilingualUI(HttpCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.admin = cls.env.ref("base.user_admin")
        cls.admin.write(
            {"group_ids": [Command.link(cls.env.ref("fu_core.group_fu_owner_admin").id)]}
        )
        cls.store = cls.env["stock.location"].search(
            [
                ("company_id", "=", cls.env.company.id),
                ("fu_location_role", "=", "store"),
            ],
            limit=1,
        )
        product = cls.env["product.product"].create(
            {
                "name": "Phase 3A Hosted Production Polo - M",
                "is_storable": True,
                "list_price": 100.0,
                "taxes_id": [Command.clear()],
            }
        )
        partner = cls.env["res.partner"].create({"name": "Phase 3A Hosted Customer"})
        config = cls.env["fu.production.config"]._fu_get_or_create(cls.env.company)
        config.with_user(cls.admin).write({"quantity_threshold": 1.0})
        order_id = cls.env["sale.order"].with_user(cls.admin).fu_create_preorder(
            partner.id,
            fields.Datetime.now() + timedelta(days=30),
            [{"product_id": product.id, "quantity": 1}],
            cls.store.id,
        )
        cls.task = cls.env["fu.production.task"].sudo().search(
            [("line_ids.preorder_id", "=", order_id)], limit=1
        )
        if not cls.task:
            raise AssertionError("Phase 3A browser fixture requires a queued production task")

    def _set_language(self, arabic):
        if arabic:
            install_arabic(self.env, self.admin)
        else:
            self.admin.lang = "en_US"

    def _task_action(self):
        return self.env["ir.actions.act_window"].create(
            {
                "name": "Hosted Phase 3A production UI",
                "res_model": "fu.production.task",
                "view_mode": "form",
                "view_id": self.env.ref("fu_production.fu_production_task_form").id,
                "res_id": self.task.id,
                "target": "current",
            }
        )

    def _show_task(self, arabic=False):
        self._set_language(arabic)
        action = self._task_action()
        expected_start = "بدء الإنتاج" if arabic else "Start Production"
        expected_demand = "طلب الإنتاج" if arabic else "Production Demand"
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
                const start = await waitFor('button[name="action_start"]');
                if (!start.innerText.includes({expected_start!r})) throw new Error('Localized Start Production action missing');
                if (!form.innerText.includes({expected_demand!r})) throw new Error('Localized production demand context missing');
                start.focus();
                if (document.activeElement !== start) throw new Error('Production action cannot receive keyboard focus');
                {"if (getComputedStyle(form).direction !== 'rtl') throw new Error('Arabic production form is not rendered RTL');" if arabic else ""}
                console.log('test successful');
            }})();
        """
        with capture_views("production_queue_ar" if arabic else "production_queue_en", rtl=arabic):
            self.browser_js(
                f"/odoo/action-{action.id}",
                code,
                ready="!!document.querySelector('.o_form_view')",
                login="admin",
                timeout=60,
            )

    def test_production_queue_english(self):
        self._show_task()

    def test_production_queue_arabic_rtl(self):
        self._show_task(arabic=True)
