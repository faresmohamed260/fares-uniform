from odoo import Command
from odoo.exceptions import AccessError, ValidationError
from odoo.tests import tagged
from odoo.tests.common import TransactionCase


@tagged("post_install", "-at_install")
class TestFaresBusinessWorkflow(TransactionCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.env.user.group_ids += cls.env.ref("fu_core.group_fu_owner_admin")
        cls.partner = cls.env["res.partner"].create(
            {
                "name": "Phase 3B Synthetic Business Client",
                "company_type": "company",
                "email": "buyer@example.invalid",
            }
        )
        cls.sales = cls._make_user("sales", cls.env.ref("fu_core.group_fu_sales_bd"))
        cls.sales_other = cls._make_user(
            "sales-other", cls.env.ref("fu_core.group_fu_sales_bd")
        )
        cls.cashier = cls._make_user("cashier", cls.env.ref("fu_core.group_fu_cashier"))
        cls.inventory = cls._make_user(
            "inventory", cls.env.ref("fu_core.group_fu_inventory_staff")
        )
        cls.production = cls._make_user(
            "production", cls.env.ref("fu_core.group_fu_production_manager")
        )

    @classmethod
    def _make_user(cls, suffix, group):
        return cls.env["res.users"].with_context(no_reset_password=True).create(
            {
                "name": f"Phase 3B {suffix}",
                "login": f"phase3b-{suffix}@example.invalid",
                "email": f"phase3b-{suffix}@example.invalid",
                "group_ids": [Command.set([group.id])],
            }
        )

    def _lead(self, suffix="client"):
        return self.env["crm.lead"].with_user(self.sales).create(
            {
                "name": f"Phase 3B {suffix}",
                "fu_business_client": True,
                "partner_id": self.partner.id,
                "partner_name": self.partner.name,
                "contact_name": "Procurement Contact",
                "email_from": "buyer@example.invalid",
                "phone": "+200000000000",
                "fu_design_requirements": "Embroidered staff uniform sample",
            }
        )

    def test_sales_can_create_assigned_business_enquiry_without_broadening_other_roles(self):
        lead = self._lead()
        self.assertTrue(lead.fu_business_client)
        self.assertEqual(lead.user_id, self.sales)
        self.assertEqual(lead.type, "opportunity")
        self.assertEqual(lead.fu_sample_state, "not_started")
        self.assertEqual(lead.phone, "+200000000000")
        self.assertFalse(self.partner.sudo().phone)

        lead.write({"phone": "+201111111111"})
        self.assertEqual(lead.phone, "+201111111111")
        self.assertFalse(self.partner.sudo().phone)

        for user in (self.cashier, self.inventory, self.production):
            with self.assertRaises(AccessError):
                self.env["crm.lead"].with_user(user).create(
                    {
                        "name": "Unauthorized Phase 3B enquiry",
                        "fu_business_client": True,
                    }
                )

    def test_sales_scope_and_sample_audit_fields_are_server_controlled(self):
        lead = self._lead("scope")
        lead.write({"fu_design_requirements": "Updated approved design brief"})
        self.assertEqual(lead.fu_design_requirements, "Updated approved design brief")

        with self.assertRaises(AccessError):
            lead.write({"fu_sample_state": "approved"})
        with self.assertRaises(AccessError):
            lead.write({"user_id": self.sales_other.id})
        with self.assertRaises(AccessError):
            lead.with_user(self.sales_other).write(
                {"fu_design_requirements": "Scope bypass attempt"}
            )

    def test_sample_workflow_is_explicit_attributable_and_revision_safe(self):
        lead = self._lead("sample")
        with self.assertRaises(ValidationError):
            lead.action_fu_approve_sample()

        lead.action_fu_prepare_sample()
        self.assertEqual(lead.fu_sample_state, "preparing")
        lead.write({"fu_sample_reference": "P3B-SAMPLE-001"})
        lead.action_fu_mark_sample_sent()
        self.assertEqual(lead.fu_sample_state, "sent")
        self.assertEqual(lead.fu_sample_sent_by_id, self.sales)
        self.assertTrue(lead.fu_sample_sent_at)

        lead.action_fu_request_revision()
        self.assertEqual(lead.fu_sample_state, "revision")
        lead.action_fu_prepare_sample()
        lead.action_fu_mark_sample_sent()
        lead.action_fu_approve_sample()
        self.assertEqual(lead.fu_sample_state, "approved")
        self.assertEqual(lead.fu_sample_decided_by_id, self.sales)
        self.assertTrue(lead.fu_sample_decided_at)

        with self.assertRaises(ValidationError):
            lead.action_fu_prepare_sample()
        with self.assertRaises(AccessError):
            lead.sudo().write({"fu_sample_decided_by_id": self.sales_other.id})

    def test_draft_quotation_requires_approval_is_retry_safe_and_has_no_stock_or_payment_effect(self):
        lead = self._lead("quotation")
        with self.assertRaises(ValidationError):
            lead.action_fu_create_business_quotation()

        lead.action_fu_prepare_sample()
        lead.action_fu_mark_sample_sent()
        lead.action_fu_approve_sample()

        picking_count = self.env["stock.picking"].sudo().search_count([])
        payment_count = self.env["account.payment"].sudo().search_count([])

        action = lead.action_fu_create_business_quotation()
        order = self.env["sale.order"].sudo().browse(action["res_id"])
        self.assertTrue(order.fu_business_order)
        self.assertEqual(order.opportunity_id, lead.sudo())
        self.assertEqual(order.partner_id, self.partner)
        self.assertEqual(order.state, "draft")

        second = lead.action_fu_create_business_quotation()
        self.assertEqual(second["res_id"], order.id)
        self.assertEqual(
            self.env["sale.order"].sudo().search_count(
                [
                    ("opportunity_id", "=", lead.id),
                    ("fu_business_order", "=", True),
                    ("state", "in", ["draft", "sent"]),
                ]
            ),
            1,
        )
        self.assertEqual(self.env["stock.picking"].sudo().search_count([]), picking_count)
        self.assertEqual(self.env["account.payment"].sudo().search_count([]), payment_count)

    def test_business_confirmation_and_direct_state_escalation_fail_closed(self):
        lead = self._lead("guard")
        lead.action_fu_prepare_sample()
        lead.action_fu_mark_sample_sent()
        lead.action_fu_approve_sample()
        order_id = lead.action_fu_create_business_quotation()["res_id"]
        order = self.env["sale.order"].sudo().browse(order_id)

        with self.assertRaisesRegex(ValidationError, "confirmation remains blocked"):
            order.action_confirm()
        with self.assertRaisesRegex(ValidationError, "policy-gated"):
            order.write({"state": "sale"})
        with self.assertRaises(AccessError):
            self.env["sale.order"].sudo().create(
                {
                    "partner_id": self.partner.id,
                    "opportunity_id": lead.id,
                }
            )
        self.assertEqual(order.state, "draft")

    def test_ordinary_order_cannot_be_relinked_into_business_path(self):
        lead = self._lead("relink")
        ordinary = self.env["sale.order"].sudo().create({"partner_id": self.partner.id})
        with self.assertRaisesRegex(AccessError, "linkage is system controlled"):
            ordinary.write({"opportunity_id": lead.id, "state": "sale"})
        ordinary.invalidate_recordset(["opportunity_id", "state", "fu_business_order"])
        self.assertFalse(ordinary.opportunity_id)
        self.assertFalse(ordinary.fu_business_order)
        self.assertEqual(ordinary.state, "draft")

    def test_ordinary_non_business_sale_confirmation_is_not_globally_blocked(self):
        order = self.env["sale.order"].sudo().create({"partner_id": self.partner.id})
        self.assertFalse(order.fu_business_order)
        order.action_confirm()
        self.assertEqual(order.state, "sale")

    def test_business_quotation_visibility_follows_assigned_sales_scope(self):
        lead = self._lead("visibility")
        lead.action_fu_prepare_sample()
        lead.action_fu_mark_sample_sent()
        lead.action_fu_approve_sample()
        order_id = lead.action_fu_create_business_quotation()["res_id"]
        order = self.env["sale.order"].browse(order_id)

        self.assertEqual(order.with_user(self.sales).name, order.sudo().name)
        with self.assertRaises(AccessError):
            order.with_user(self.sales_other).read(["name"])
