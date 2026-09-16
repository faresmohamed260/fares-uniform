from datetime import timedelta

from odoo import Command, fields
from odoo.tests import HttpCase, TransactionCase, tagged

from odoo.addons.fu_core.tests.visual_capture import capture_views, install_arabic


@tagged("post_install", "-at_install")
class TestFaresBusinessUIContracts(TransactionCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.env.user.group_ids += cls.env.ref("fu_core.group_fu_owner_admin")

    def test_business_workspace_commercial_and_delivery_views_are_registered(self):
        action = self.env.ref("fu_business.action_fu_business_clients")
        lead_form = self.env.ref("fu_business.fu_business_lead_form")
        order_form = self.env.ref("fu_business.fu_business_sale_order_form")
        editor_form = self.env.ref("fu_business.fu_business_quotation_wizard_form")
        payment_form = self.env.ref("fu_business.fu_business_payment_wizard_form")
        delivery_form = self.env.ref("fu_business.fu_business_delivery_form")
        menu = self.env.ref("fu_business.menu_fu_business_clients")
        self.assertEqual(action.res_model, "crm.lead")
        self.assertEqual(lead_form.model, "crm.lead")
        self.assertEqual(order_form.model, "sale.order")
        self.assertEqual(editor_form.model, "fu.business.quotation.wizard")
        self.assertEqual(payment_form.model, "fu.business.payment.wizard")
        self.assertEqual(delivery_form.model, "stock.picking")
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
        cls.product = cls.env["product.product"].create(
            {
                "name": "Phase 3B Hosted Uniform",
                "is_storable": True,
                "lst_price": 200.0,
                "taxes_id": [Command.clear()],
            }
        )
        cls.cash_journal = cls.env["account.journal"].create(
            {
                "name": "Phase 3B Hosted Cash",
                "type": "cash",
                "code": "P3BU",
                "company_id": cls.env.company.id,
                "fu_confirmation_mode": "none",
            }
        )
        cls.cash_method = cls.cash_journal.inbound_payment_method_line_ids[:1]
        if not cls.cash_method:
            raise AssertionError("Hosted Phase 3B cash journal needs an inbound payment method")

        cls.lead = cls._approved_lead("Hosted Uniform Enquiry")
        quotation_id = cls.lead.action_fu_create_business_quotation()["res_id"]
        cls.quotation = cls.env["sale.order"].browse(quotation_id)
        cls._set_terms(cls.quotation, "HOSTED-PO-001")

        delivery_lead = cls._approved_lead("Hosted Delivery Enquiry")
        delivery_order_id = delivery_lead.action_fu_create_business_quotation()["res_id"]
        cls.delivery_order = cls.env["sale.order"].browse(delivery_order_id)
        cls._set_terms(cls.delivery_order, "HOSTED-DELIVERY-001")
        cls.delivery_order.with_user(cls.admin).fu_record_business_payment(
            50.0,
            cls.cash_journal.id,
            cls.cash_method.id,
            "HOSTED-P3B-DELIVERY-DEPOSIT",
        )
        cls.delivery_order.with_user(cls.admin).action_fu_confirm_business_order()
        cls.delivery_order.invalidate_recordset()
        cls.delivery = cls.delivery_order.picking_ids.filtered(
            lambda picking: picking.location_dest_id.usage == "customer"
        )[:1]
        if not cls.delivery:
            raise AssertionError("Hosted Phase 3B delivery fixture must create a native customer picking")

    @classmethod
    def _approved_lead(cls, suffix):
        lead = cls.env["crm.lead"].with_user(cls.admin).create(
            {
                "name": f"Phase 3B {suffix}",
                "fu_business_client": True,
                "partner_id": cls.partner.id,
                "partner_name": cls.partner.name,
                "contact_name": "Hosted Procurement Contact",
                "fu_design_requirements": "Hosted bilingual design brief",
            }
        )
        lead.action_fu_prepare_sample()
        lead.action_fu_mark_sample_sent()
        lead.action_fu_approve_sample()
        return lead

    @classmethod
    def _set_terms(cls, order, reference):
        editor = cls.env["fu.business.quotation.wizard"].with_user(cls.admin).create(
            {
                "quotation_id": order.id,
                "client_order_ref": reference,
                "commitment_date": fields.Datetime.now() + timedelta(days=14),
                "line_ids": [
                    Command.create(
                        {
                            "product_id": cls.product.id,
                            "quantity": 2,
                            "unit_price": 175.0,
                        }
                    )
                ],
            }
        )
        editor.action_save_draft()
        order.invalidate_recordset()

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

    def _quotation_action(self):
        return self.env["ir.actions.act_window"].create(
            {
                "name": "Hosted Phase 3B order UI",
                "res_model": "sale.order",
                "view_mode": "form",
                "view_id": self.env.ref("fu_business.fu_business_sale_order_form").id,
                "res_id": self.quotation.id,
                "target": "current",
            }
        )

    def _delivery_action(self):
        return self.env["ir.actions.act_window"].create(
            {
                "name": "Hosted Phase 3B delivery UI",
                "res_model": "stock.picking",
                "view_mode": "form",
                "view_id": self.env.ref("fu_business.fu_business_delivery_form").id,
                "res_id": self.delivery.id,
                "target": "current",
            }
        )

    def _show_lead(self, arabic=False):
        self._set_language(arabic)
        action = self._lead_action()
        expected_design = "متطلبات التصميم" if arabic else "Design requirements"
        expected_gate = (
            "التنفيذ التجاري يتبع قواعد المرحلة 3B المعتمدة"
            if arabic
            else "Commercial execution follows the accepted Phase 3B"
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
                if (!form.innerText.includes({expected_design!r})) throw new Error('Localized design requirements context missing');
                if (!form.innerText.includes({expected_gate!r})) throw new Error('Accepted commercial-policy warning missing');
                const status = await waitFor('.o_field_widget[name="fu_sample_state"]');
                if (!status.innerText) throw new Error('Sample status missing');
                const orderButton = await waitFor('button[name="action_fu_create_business_quotation"]');
                orderButton.focus();
                if (document.activeElement !== orderButton) throw new Error('Business workflow action cannot receive keyboard focus');
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

    def _show_draft_editor(self, arabic=False):
        self._set_language(arabic)
        action = self._quotation_action()
        expected_edit = "تعديل / اعتماد تغيير المسودة" if arabic else "Edit / Approve Draft Change"
        expected_title = "تفاصيل عرض السعر المبدئي" if arabic else "Draft Quotation Details"
        expected_warning = (
            "قبل الدفع، يمكن لمسؤول المبيعات"
            if arabic
            else "Before payment, assigned Sales/BD may edit the draft"
        )
        expected_save = "حفظ المسودة" if arabic else "Save Draft"
        expected_cancel = "إلغاء" if arabic else "Cancel"
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
                await waitFor('.o_form_view');
                const edit = [...document.querySelectorAll('button[name="action_fu_open_draft_editor"]')].find(button => button.offsetParent !== null);
                if (!edit || !edit.innerText.includes({expected_edit!r})) throw new Error('Localized draft-editor action missing');
                edit.click();
                const dialog = await waitFor('.o_dialog');
                const title = dialog.querySelector('.modal-title');
                if (!title || !title.innerText.includes({expected_title!r})) throw new Error('Localized draft-editor title missing');
                if (!dialog.innerText.includes({expected_warning!r})) throw new Error('Draft-editor approval warning missing');
                const save = await waitFor('.o_dialog button[name="action_save_draft"]');
                if (!save.innerText.includes({expected_save!r})) throw new Error('Localized Save Draft action missing');
                const cancel = [...dialog.querySelectorAll('button')].find(button => button.innerText.includes({expected_cancel!r}));
                if (!cancel) throw new Error('Localized Cancel action missing');
                save.focus();
                if (document.activeElement !== save) throw new Error('Save Draft action cannot receive keyboard focus');
                if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 2) throw new Error('Draft editor has horizontal viewport overflow');
                {"if (getComputedStyle(dialog).direction !== 'rtl') throw new Error('Arabic draft editor is not rendered RTL');" if arabic else ""}
                console.log('test successful');
            }})();
        """
        with capture_views("business_draft_editor_ar" if arabic else "business_draft_editor_en", rtl=arabic):
            self.browser_js(
                f"/odoo/action-{action.id}",
                code,
                ready="!!document.querySelector('button[name=\"action_fu_open_draft_editor\"]')",
                login="admin",
                timeout=60,
            )

    def _show_payment_wizard(self, arabic=False):
        self._set_language(arabic)
        action = self._quotation_action()
        expected_payment = "تسجيل دفعة" if arabic else "Record Payment"
        expected_title = "تسجيل دفعة طلب شركة" if arabic else "Record Business Payment"
        expected_balance = "الرصيد المتبقي" if arabic else "Balance Due"
        expected_warning = (
            "أدخل العربون الإيجابي المتفق عليه"
            if arabic
            else "Enter the negotiated positive deposit or later balance payment"
        )
        expected_cancel = "إلغاء" if arabic else "Cancel"
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
                await waitFor('.o_form_view');
                const payment = await waitFor('button[name="action_fu_open_business_payment"]');
                if (!payment.innerText.includes({expected_payment!r})) throw new Error('Localized payment action missing');
                payment.click();
                const dialog = await waitFor('.o_dialog');
                const title = dialog.querySelector('.modal-title');
                if (!title || !title.innerText.includes({expected_title!r})) throw new Error('Localized payment title missing');
                if (!dialog.innerText.includes({expected_balance!r})) throw new Error('Localized balance label missing');
                if (!dialog.innerText.includes({expected_warning!r})) throw new Error('Payment policy warning missing');
                const record = await waitFor('.o_dialog button[name="action_record_payment"]');
                if (!record.innerText.includes({expected_payment!r})) throw new Error('Localized Record Payment action missing');
                const cancel = [...dialog.querySelectorAll('button')].find(button => button.innerText.includes({expected_cancel!r}));
                if (!cancel) throw new Error('Localized payment Cancel action missing');
                record.focus();
                if (document.activeElement !== record) throw new Error('Record Payment action cannot receive keyboard focus');
                if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 2) throw new Error('Payment wizard has horizontal viewport overflow');
                {"if (getComputedStyle(dialog).direction !== 'rtl') throw new Error('Arabic payment wizard is not rendered RTL');" if arabic else ""}
                console.log('test successful');
            }})();
        """
        with capture_views("business_payment_ar" if arabic else "business_payment_en", rtl=arabic):
            self.browser_js(
                f"/odoo/action-{action.id}",
                code,
                ready="!!document.querySelector('button[name=\"action_fu_open_business_payment\"]')",
                login="admin",
                timeout=60,
            )

    def _show_delivery(self, arabic=False):
        self._set_language(arabic)
        action = self._delivery_action()
        expected_release = "تسليم الشحنة كاملة" if arabic else "Release Complete Shipment"
        expected_warning = (
            "لا يسمح بالتسليم إلا بعد سداد كامل رصيد طلب الشركة"
            if arabic
            else "Release is allowed only when the whole business-order balance is paid"
        )
        expected_audit = (
            "منفذ تسليم شحنة الشركة"
            if arabic
            else "Business shipment released by"
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
                const release = await waitFor('button[name="fu_release_business_delivery"]');
                if (!release.innerText.includes({expected_release!r})) throw new Error('Localized complete-shipment action missing');
                if (!form.innerText.includes({expected_warning!r})) throw new Error('Shipment policy warning missing');
                await waitFor('.o_field_widget[name="location_id"]');
                await waitFor('.o_field_widget[name="location_dest_id"]');
                if (!form.innerText.includes({expected_audit!r})) throw new Error('Localized shipment audit context missing');
                release.focus();
                if (document.activeElement !== release) throw new Error('Complete-shipment action cannot receive keyboard focus');
                if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 2) throw new Error('Business delivery has horizontal viewport overflow');
                {"if (getComputedStyle(form).direction !== 'rtl') throw new Error('Arabic business delivery is not rendered RTL');" if arabic else ""}
                console.log('test successful');
            }})();
        """
        with capture_views("business_delivery_ar" if arabic else "business_delivery_en", rtl=arabic):
            self.browser_js(
                f"/odoo/action-{action.id}",
                code,
                ready="!!document.querySelector('button[name=\"fu_release_business_delivery\"]')",
                login="admin",
                timeout=60,
            )

    def test_business_clients_english(self):
        self._show_lead()

    def test_business_clients_arabic_rtl(self):
        self._show_lead(arabic=True)

    def test_business_draft_editor_english(self):
        self._show_draft_editor()

    def test_business_draft_editor_arabic_rtl(self):
        self._show_draft_editor(arabic=True)

    def test_business_payment_english(self):
        self._show_payment_wizard()

    def test_business_payment_arabic_rtl(self):
        self._show_payment_wizard(arabic=True)

    def test_business_delivery_english(self):
        self._show_delivery()

    def test_business_delivery_arabic_rtl(self):
        self._show_delivery(arabic=True)
