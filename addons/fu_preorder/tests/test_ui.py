from datetime import timedelta

from odoo import Command, fields
from odoo.exceptions import AccessError
from odoo.tests import HttpCase, tagged
from odoo.tests.common import TransactionCase

from odoo.addons.fu_core.tests.visual_capture import capture_views, install_arabic


@tagged("post_install", "-at_install")
class TestFaresPreorderUIContracts(TransactionCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.env.user.group_ids += cls.env.ref("fu_core.group_fu_owner_admin")
        cls.store = cls.env["stock.location"].search(
            [
                ("company_id", "=", cls.env.company.id),
                ("fu_location_role", "=", "store"),
            ],
            limit=1,
        )
        cls.product = cls.env["product.product"].create(
            {
                "name": "Phase 2B UI Contract Polo",
                "is_storable": True,
                "lst_price": 120.0,
                "taxes_id": [Command.clear()],
            }
        )
        cls.partner = cls.env["res.partner"].create(
            {"name": "Phase 2B UI Contract Customer"}
        )
        cls.cash_journal = cls.env["account.journal"].create(
            {
                "name": "Phase 2B UI Cash",
                "type": "cash",
                "code": "P2UC",
                "company_id": cls.env.company.id,
                "fu_confirmation_mode": "none",
            }
        )
        cls.cashier = cls._make_user("cashier", "fu_core.group_fu_cashier")
        cls.manager = cls._make_user("manager", "fu_core.group_fu_store_manager")
        cls.inventory = cls._make_user("inventory", "fu_core.group_fu_inventory_staff")

    @classmethod
    def _make_user(cls, suffix, group_xmlid):
        return cls.env["res.users"].with_context(no_reset_password=True).create(
            {
                "name": f"Phase 2B UI {suffix}",
                "login": f"phase2b-ui-{suffix}@example.invalid",
                "email": f"phase2b-ui-{suffix}@example.invalid",
                "group_ids": [Command.set([cls.env.ref(group_xmlid).id])],
                "fu_stock_location_ids": [Command.set([cls.store.id])],
            }
        )

    def test_native_ui_workflows_delegate_to_guarded_services_and_keep_read_scope_narrow(self):
        create_wizard = self.env["fu.preorder.create.wizard"].with_user(self.cashier).create(
            {
                "partner_id": self.partner.id,
                "commitment_date": fields.Datetime.now() + timedelta(days=14),
                "store_location_id": self.store.id,
                "line_ids": [
                    Command.create(
                        {
                            "product_id": self.product.id,
                            "quantity": 1,
                        }
                    )
                ],
            }
        )
        action = create_wizard.action_create()
        order = self.env["sale.order"].sudo().browse(action["res_id"])
        self.assertTrue(order.fu_is_preorder)
        self.assertEqual(order.user_id, self.cashier)
        self.assertEqual(order.fu_store_location_id, self.store)

        ordinary = self.env["sale.order"].sudo().create(
            {
                "partner_id": self.partner.id,
                "order_line": [
                    Command.create(
                        {
                            "product_id": self.product.id,
                            "product_uom_qty": 1,
                        }
                    )
                ],
            }
        )
        visible_ids = self.env["sale.order"].with_user(self.cashier).search(
            [("id", "in", [order.id, ordinary.id])]
        ).ids
        self.assertEqual(visible_ids, [order.id])

        payment = self.env["fu.preorder.payment.wizard"].with_user(self.cashier).with_context(
            default_preorder_id=order.id
        ).create(
            {
                "preorder_id": order.id,
                "amount": order.amount_total / 2,
                "journal_key": str(self.cash_journal.id),
            }
        )
        payment.action_record_payment()
        order.invalidate_recordset(["fu_preorder_payment_ids"])
        self.assertAlmostEqual(order.fu_amount_paid, order.amount_total / 2)
        recorded_payment = order.fu_preorder_payment_ids
        self.assertEqual(recorded_payment.fu_recorded_by_user_id, self.cashier)
        self.assertEqual(recorded_payment.fu_payment_kind, "cash")
        self.assertEqual(
            self.env["account.payment"].with_user(self.cashier).search_count(
                [("id", "=", recorded_payment.id)]
            ),
            1,
        )
        with self.assertRaises(AccessError):
            self.env["account.payment"].with_user(self.inventory).search_count(
                [("id", "=", recorded_payment.id)]
            )

        self.env["fu.stock.movement.request"].process_idempotent(
            "P2B-UI-CONTRACT-STOCK",
            "opening",
            product_id=self.product.id,
            quantity=1,
            destination_location_id=self.store.id,
            reason="Phase 2B UI contract stock",
            batch_ref="P2B-UI-CONTRACT",
        )
        allocation = self.env["fu.preorder.allocation.wizard"].with_user(self.inventory).with_context(
            default_preorder_id=order.id
        ).create({})
        self.assertEqual(len(allocation.line_ids), 1)
        allocation.line_ids.quantity = 1
        allocation.action_allocate()
        self.assertAlmostEqual(order.order_line.fu_ready_qty, 1)

        final_payment = self.env["fu.preorder.payment.wizard"].with_user(self.cashier).with_context(
            default_preorder_id=order.id
        ).create(
            {
                "preorder_id": order.id,
                "amount": order.fu_balance_due,
                "journal_key": str(self.cash_journal.id),
            }
        )
        final_payment.action_record_payment()
        self.assertTrue(order.currency_id.is_zero(order.fu_balance_due))

        collection = self.env["fu.preorder.collection.wizard"].with_user(self.cashier).with_context(
            default_preorder_id=order.id
        ).create({})
        self.assertTrue(collection.fully_paid)
        self.assertEqual(len(collection.line_ids), 1)
        collection.line_ids.quantity = 1
        collection.action_collect()
        self.assertAlmostEqual(order.order_line.fu_collected_qty, 1)
        self.assertEqual(order.fu_collection_state, "collected")

        with self.assertRaises(AccessError):
            self.env["fu.preorder.allocation.wizard"].with_user(self.cashier).create(
                {"preorder_id": order.id}
            )
        with self.assertRaises(AccessError):
            self.env["fu.preorder.payment.wizard"].with_user(self.inventory).create(
                {"preorder_id": order.id}
            )


@tagged("post_install", "-at_install")
class TestFaresPreorderBilingualUI(HttpCase):
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
        cls.product_a = cls.env["product.product"].create(
            {
                "name": "School Polo Navy S",
                "is_storable": True,
                "lst_price": 100.0,
                "taxes_id": [Command.clear()],
            }
        )
        cls.product_b = cls.env["product.product"].create(
            {
                "name": "School Polo Navy M",
                "is_storable": True,
                "lst_price": 100.0,
                "taxes_id": [Command.clear()],
            }
        )
        cls.partner = cls.env["res.partner"].create(
            {"name": "Hosted Preorder Customer"}
        )
        cls.cash_journal = cls.env["account.journal"].create(
            {
                "name": "Hosted Preorder Cash",
                "type": "cash",
                "code": "P2HC",
                "company_id": cls.env.company.id,
                "fu_confirmation_mode": "none",
            }
        )
        cls.instapay_journal = cls.env["account.journal"].create(
            {
                "name": "Hosted Preorder InstaPay",
                "type": "bank",
                "code": "P2HI",
                "company_id": cls.env.company.id,
                "fu_confirmation_mode": "bank_notification",
            }
        )
        cls.cash_method = cls.cash_journal.inbound_payment_method_line_ids[:1]
        if not cls.cash_method or not cls.instapay_journal.inbound_payment_method_line_ids[:1]:
            raise AssertionError("Hosted preorder journals require native inbound payment methods")

        cls.balance_order = cls._create_order(
            [{"product_id": cls.product_a.id, "quantity": 1}]
        )
        cls.balance_order.fu_record_payment(
            cls.balance_order.amount_total / 2,
            cls.cash_journal.id,
            cls.cash_method.id,
            "P2B-UI-BALANCE-DEPOSIT",
        )
        cls.env["fu.stock.movement.request"].process_idempotent(
            "P2B-UI-BALANCE-STOCK",
            "opening",
            product_id=cls.product_a.id,
            quantity=1,
            destination_location_id=cls.store.id,
            reason="Hosted balance-order UI stock",
            batch_ref="P2B-UI-HOSTED",
        )

        cls.partial_order = cls._create_order(
            [
                {"product_id": cls.product_a.id, "quantity": 1},
                {"product_id": cls.product_b.id, "quantity": 1},
            ]
        )
        cls.partial_order.fu_record_payment(
            cls.partial_order.amount_total,
            cls.cash_journal.id,
            cls.cash_method.id,
            "P2B-UI-PARTIAL-FULL-PAYMENT",
        )
        cls.env["fu.stock.movement.request"].process_idempotent(
            "P2B-UI-PARTIAL-STOCK-A",
            "opening",
            product_id=cls.product_a.id,
            quantity=1,
            destination_location_id=cls.store.id,
            reason="Hosted partial-order UI stock A",
            batch_ref="P2B-UI-HOSTED",
        )
        cls.env["fu.stock.movement.request"].process_idempotent(
            "P2B-UI-PARTIAL-STOCK-B",
            "opening",
            product_id=cls.product_b.id,
            quantity=1,
            destination_location_id=cls.store.id,
            reason="Hosted partial-order UI stock B",
            batch_ref="P2B-UI-HOSTED",
        )
        cls.partial_order.fu_allocate_ready(
            [
                {"line_id": cls.partial_order.order_line[0].id, "quantity": 1},
                {"line_id": cls.partial_order.order_line[1].id, "quantity": 1},
            ]
        )
        cls.partial_order.fu_collect(
            [{"line_id": cls.partial_order.order_line[0].id, "quantity": 1}],
            "P2B-UI-PARTIAL-COLLECT",
        )
        cls.partial_order.invalidate_recordset()
        if cls.partial_order.fu_collection_state != "partially_collected":
            raise AssertionError("Hosted UI fixture must remain partially collected")

    @classmethod
    def _create_order(cls, lines):
        order_id = cls.env["sale.order"].with_user(cls.admin).fu_create_preorder(
            cls.partner.id,
            fields.Datetime.now() + timedelta(days=14),
            lines,
            cls.store.id,
        )
        return cls.env["sale.order"].with_user(cls.admin).browse(order_id)

    def _set_language(self, arabic):
        if arabic:
            install_arabic(self.env, self.admin)
        else:
            self.admin.lang = "en_US"

    def _record_action(self, order, name):
        return self.env["ir.actions.act_window"].create(
            {
                "name": name,
                "res_model": "sale.order",
                "res_id": order.id,
                "view_mode": "form",
                "view_id": self.env.ref("fu_preorder.fu_preorder_form").id,
                "target": "current",
            }
        )

    def _show_create(self, arabic=False):
        self._set_language(arabic)
        action = self.env.ref("fu_preorder.action_fu_preorder_create_wizard")
        expected_title = "طلب مسبق جديد" if arabic else "New Preorder"
        expected_button = "إنشاء الطلب المسبق" if arabic else "Create Preorder"
        code = f"""
            (async () => {{
                const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
                const form = document.querySelector('.o_form_view');
                if (!form) throw new Error('Preorder creation form missing');
                if (!form.innerText.includes({expected_title!r})) throw new Error('Localized preorder title missing');
                const button = document.querySelector('button[name="action_create"]');
                if (!button || !button.innerText.includes({expected_button!r})) throw new Error('Localized create action missing');
                const banner = document.querySelector('.fu-online-required-banner');
                if (!banner) throw new Error('Online-required banner missing');
                window.dispatchEvent(new Event('offline'));
                await sleep(80);
                if (!button.disabled) throw new Error('Create preorder stayed enabled offline');
                if (banner.dataset.fuOnlineState !== 'offline') throw new Error('Offline state not explained');
                window.dispatchEvent(new Event('online'));
                await sleep(80);
                if (button.disabled) throw new Error('Create preorder did not recover online');
                button.focus();
                if (document.activeElement !== button) throw new Error('Create preorder action cannot receive keyboard focus');
                console.log('test successful');
            }})();
        """
        with capture_views("preorder_create_ar" if arabic else "preorder_create_en", rtl=arabic):
            self.browser_js(
                f"/odoo/action-{action.id}",
                code,
                ready="!!document.querySelector('button[name=\"action_create\"]')",
                login="admin",
                timeout=60,
            )

    def _show_payment(self, arabic=False):
        self._set_language(arabic)
        action = self._record_action(self.balance_order, "Hosted payment UI")
        expected_button = "تسجيل دفعة" if arabic else "Record Payment"
        expected_dialog = "تسجيل دفعة الطلب المسبق" if arabic else "Record Preorder Payment"
        code = f"""
            (async () => {{
                const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
                const waitFor = async (selector) => {{
                    for (let i = 0; i < 100; i++) {{
                        const node = document.querySelector(selector);
                        if (node) return node;
                        await sleep(50);
                    }}
                    throw new Error('Timed out waiting for ' + selector);
                }};
                const actionButton = [...document.querySelectorAll('button')].find(button => button.innerText.includes({expected_button!r}));
                if (!actionButton) throw new Error('Record payment action missing');
                actionButton.click();
                const dialog = await waitFor('.o_dialog');
                if (!dialog.innerText.includes({expected_dialog!r})) throw new Error('Localized payment dialog missing');
                const submit = dialog.querySelector('button[name="action_record_payment"]');
                const banner = dialog.querySelector('.fu-online-required-banner');
                if (!submit || !banner) throw new Error('Payment online controls missing');
                window.dispatchEvent(new Event('offline'));
                await sleep(80);
                if (!submit.disabled || banner.dataset.fuOnlineState !== 'offline') throw new Error('Payment did not fail closed offline');
                window.dispatchEvent(new Event('online'));
                await sleep(80);
                if (submit.disabled) throw new Error('Payment action did not recover online');
                submit.focus();
                if (document.activeElement !== submit) throw new Error('Payment action cannot receive keyboard focus');
                console.log('test successful');
            }})();
        """
        with capture_views("preorder_payment_ar" if arabic else "preorder_payment_en", rtl=arabic):
            self.browser_js(
                f"/odoo/action-{action.id}",
                code,
                ready=f"!!document.querySelector('.o_form_view') && document.body.innerText.includes({self.balance_order.name!r})",
                login="admin",
                timeout=60,
            )

    def _show_allocation(self):
        self._set_language(False)
        action = self._record_action(self.balance_order, "Hosted allocation UI")
        code = """
            (async () => {
                const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
                const waitFor = async (selector) => {
                    for (let i = 0; i < 100; i++) {
                        const node = document.querySelector(selector);
                        if (node) return node;
                        await sleep(50);
                    }
                    throw new Error('Timed out waiting for ' + selector);
                };
                const actionButton = [...document.querySelectorAll('button')].find(button => button.innerText.includes('Allocate Ready Stock'));
                if (!actionButton) throw new Error('Readiness allocation action missing');
                actionButton.click();
                const dialog = await waitFor('.o_dialog');
                if (!dialog.innerText.includes('Store Free Stock')) throw new Error('Live store availability context missing');
                const submit = dialog.querySelector('button[name="action_allocate"]');
                if (!submit) throw new Error('Allocation submit action missing');
                submit.focus();
                if (document.activeElement !== submit) throw new Error('Allocation action cannot receive keyboard focus');
                console.log('test successful');
            })();
        """
        with capture_views("preorder_allocation_en"):
            self.browser_js(
                f"/odoo/action-{action.id}",
                code,
                ready=f"!!document.querySelector('.o_form_view') && document.body.innerText.includes({self.balance_order.name!r})",
                login="admin",
                timeout=60,
            )

    def _show_collection_arabic(self):
        self._set_language(True)
        action = self._record_action(self.partial_order, "Hosted collection UI")
        code = """
            (async () => {
                const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
                const waitFor = async (selector) => {
                    for (let i = 0; i < 100; i++) {
                        const node = document.querySelector(selector);
                        if (node) return node;
                        await sleep(50);
                    }
                    throw new Error('Timed out waiting for ' + selector);
                };
                const form = document.querySelector('.o_form_view');
                if (!form || !form.innerText.includes('تم الاستلام جزئيًا')) throw new Error('Arabic partial-collection state missing');
                const actionButton = [...document.querySelectorAll('button')].find(button => button.innerText.includes('تسجيل الاستلام'));
                if (!actionButton) throw new Error('Arabic collection action missing');
                actionButton.click();
                const dialog = await waitFor('.o_dialog');
                if (!dialog.innerText.includes('الأصناف الجاهزة')) throw new Error('Arabic ready-items context missing');
                const submit = dialog.querySelector('button[name="action_collect"]');
                if (!submit) throw new Error('Collection submit action missing');
                submit.focus();
                if (document.activeElement !== submit) throw new Error('Collection action cannot receive keyboard focus');
                console.log('test successful');
            })();
        """
        with capture_views("preorder_collection_ar", rtl=True):
            self.browser_js(
                f"/odoo/action-{action.id}",
                code,
                ready=f"!!document.querySelector('.o_form_view') && document.body.innerText.includes({self.partial_order.name!r})",
                login="admin",
                timeout=60,
            )

    def test_preorder_creation_english_online_guard(self):
        self._show_create()

    def test_preorder_creation_arabic_rtl_online_guard(self):
        self._show_create(arabic=True)

    def test_preorder_payment_english_online_guard(self):
        self._show_payment()

    def test_preorder_payment_arabic_rtl_online_guard(self):
        self._show_payment(arabic=True)

    def test_preorder_readiness_allocation_english(self):
        self._show_allocation()

    def test_preorder_partial_collection_arabic_rtl(self):
        self._show_collection_arabic()
