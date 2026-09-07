from odoo import Command
from odoo.tests import HttpCase, tagged
from odoo.tests.common import TransactionCase

from .visual_capture import capture_views, install_arabic


class TestFaresUIContracts(TransactionCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.owner_group = cls.env.ref("fu_core.group_fu_owner_admin")
        cls.inventory_group = cls.env.ref("fu_core.group_fu_inventory_staff")
        cls.store = cls.env["stock.location"].search(
            [("company_id", "=", cls.env.company.id), ("fu_location_role", "=", "store")],
            limit=1,
        )
        cls.storage = cls.env["stock.location"].search(
            [("company_id", "=", cls.env.company.id), ("fu_location_role", "=", "storage")],
            limit=1,
        )
        cls.product = cls.env["product.template"].create(
            {"name": "UI Contract Polo", "is_storable": True}
        ).product_variant_id
        cls.owner = cls._make_user("ui-owner", cls.owner_group, [cls.store, cls.storage])
        cls.inventory = cls._make_user("ui-inventory", cls.inventory_group, [cls.store])

    @classmethod
    def _make_user(cls, suffix, group, locations):
        return cls.env["res.users"].with_context(no_reset_password=True).create(
            {
                "name": suffix,
                "login": f"{suffix}@example.invalid",
                "email": f"{suffix}@example.invalid",
                "group_ids": [Command.set([group.id])],
                "fu_stock_location_ids": [Command.set([location.id for location in locations])],
            }
        )

    def test_inventory_wizard_exposes_only_assigned_location_and_executes_service(self):
        wizard = self.env["fu.stock.movement.wizard"].with_user(self.inventory).create(
            {
                "operation": "opening",
                "product_id": self.product.id,
                "quantity": 3,
                "destination_location_id": self.store.id,
                "reason": "UI contract opening",
                "batch_ref": "UI-CONTRACT",
            }
        )
        self.assertEqual(wizard.allowed_location_ids, self.store)
        action = wizard.action_submit()
        request = self.env["fu.stock.movement.request"].browse(action["res_id"])
        self.assertEqual(request.actor_id, self.inventory)
        self.assertEqual(request.destination_location_id, self.store)
        self.assertEqual(request.state, "done")

    def test_owner_wizard_sees_both_confirmed_custody_locations(self):
        wizard = self.env["fu.stock.movement.wizard"].with_user(self.owner).create(
            {
                "product_id": self.product.id,
                "destination_location_id": self.store.id,
                "reason": "UI contract owner scope",
            }
        )
        self.assertEqual(set(wizard.allowed_location_ids.ids), {self.store.id, self.storage.id})

    def test_operational_actions_use_read_only_native_models(self):
        product_action = self.env.ref("fu_core.action_fu_products")
        stock_action = self.env.ref("fu_core.action_fu_on_hand")
        self.assertEqual(product_action.res_model, "product.product")
        self.assertEqual(stock_action.res_model, "stock.quant")
        self.assertEqual(product_action.domain, "[('is_storable', '=', True)]")
        self.assertIn("fu_location_role", stock_action.domain)


@tagged("post_install", "-at_install")
class TestFaresBilingualUI(HttpCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.admin = cls.env.ref("base.user_admin")
        cls.admin.write(
            {"group_ids": [Command.link(cls.env.ref("fu_core.group_fu_owner_admin").id)]}
        )
        cls.product = cls.env["product.template"].create(
            {"name": "School Polo Navy", "is_storable": True}
        ).product_variant_id
        cls.store = cls.env["stock.location"].search(
            [("company_id", "=", cls.env.company.id), ("fu_location_role", "=", "store")],
            limit=1,
        )
        cls.env["fu.stock.movement.request"].with_user(cls.admin).process_idempotent(
            "UI-EVIDENCE-OPEN-001",
            "opening",
            product_id=cls.product.id,
            quantity=12,
            destination_location_id=cls.store.id,
            reason="Hosted UI evidence",
            batch_ref="UI-EVIDENCE",
        )

    def _set_language(self, arabic):
        if arabic:
            install_arabic(self.env, self.admin)
        else:
            self.admin.lang = "en_US"

    def _show_products(self, arabic=False):
        self._set_language(arabic)
        action = self.env.ref("fu_core.action_fu_products")
        expected_title = "البحث عن منتجات فارس" if arabic else "Fares Product Lookup"
        code = f"""
            (async () => {{
                const list = document.querySelector('.o_list_view');
                if (!list) throw new Error('Product list missing');
                if (!list.innerText.includes('School Polo Navy')) throw new Error('Synthetic product missing');
                if (!/FU-\\d{{6}}/.test(list.innerText)) throw new Error('Permanent item code missing');
                if (!document.body.innerText.includes({expected_title!r})) throw new Error('Localized action title missing');
                const search = document.querySelector('.o_searchview_input');
                if (!search) throw new Error('Native search input missing');
                search.focus();
                if (document.activeElement !== search) throw new Error('Search cannot receive keyboard focus');
                console.log('test successful');
            }})();
        """
        with capture_views("product_ar" if arabic else "product_en", rtl=arabic):
            self.browser_js(
                f"/odoo/action-{action.id}",
                code,
                ready="!!document.querySelector('.o_list_view')",
                login="admin",
                timeout=60,
            )

    def _show_stock_operation(self, arabic=False):
        self._set_language(arabic)
        action = self.env.ref("fu_core.action_fu_stock_movement_wizard")
        expected_button = "تنفيذ عملية المخزون" if arabic else "Execute Stock Operation"
        code = f"""
            (async () => {{
                const form = document.querySelector('.o_form_view');
                if (!form) throw new Error('Stock operation form missing');
                if (!document.body.innerText.includes({expected_button!r})) throw new Error('Localized stock action missing');
                const button = document.querySelector('button[name="action_submit"]');
                if (!button) throw new Error('Execute button missing');
                button.focus();
                if (document.activeElement !== button) throw new Error('Execute button cannot receive keyboard focus');
                if (!document.querySelector('input[id^="product_id"]') && !form.innerText.includes('Product')) {{
                    throw new Error('Native product control missing');
                }}
                console.log('test successful');
            }})();
        """
        with capture_views("stock_ar" if arabic else "stock_en", rtl=arabic):
            self.browser_js(
                f"/odoo/action-{action.id}",
                code,
                ready="!!document.querySelector('button[name=\"action_submit\"]')",
                login="admin",
                timeout=60,
            )

    def test_product_lookup_english(self):
        self._show_products()

    def test_product_lookup_arabic_rtl(self):
        self._show_products(arabic=True)

    def test_stock_operation_english(self):
        self._show_stock_operation()

    def test_stock_operation_arabic_rtl(self):
        self._show_stock_operation(arabic=True)
