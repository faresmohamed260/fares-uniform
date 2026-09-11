from odoo import _, api, fields, models
from odoo.exceptions import AccessError, ValidationError

from .business import _OWNER_GROUP, _trusted_context


_PAYMENT_CONTEXT = "fu_business_payment_execution"
_PAYMENT_OPERATOR_GROUPS = (
    "fu_core.group_fu_cashier",
    "fu_core.group_fu_store_manager",
)


class SaleOrder(models.Model):
    _inherit = "sale.order"

    fu_business_payment_ids = fields.One2many(
        "account.payment",
        "fu_business_order_id",
        string="Business payments",
        readonly=True,
    )
    fu_business_amount_paid = fields.Monetary(
        string="Business amount paid",
        currency_field="currency_id",
        compute="_compute_fu_business_financials",
    )
    fu_business_balance_due = fields.Monetary(
        string="Business balance due",
        currency_field="currency_id",
        compute="_compute_fu_business_financials",
    )
    fu_business_payment_state = fields.Selection(
        [
            ("unpaid", "No payment"),
            ("deposit", "Deposit / balance due"),
            ("paid", "Fully paid"),
        ],
        string="Business payment state",
        compute="_compute_fu_business_financials",
    )

    def _fu_business_sudo(self):
        self.ensure_one()
        order = self.sudo().exists()
        if not order or not order.fu_business_order:
            raise ValidationError(_("This operation requires a Fares business order."))
        return order

    def _fu_assert_business_payment_operator(self):
        if self.env.su or self.env.user.has_group(_OWNER_GROUP):
            return
        if not any(self.env.user.has_group(group) for group in _PAYMENT_OPERATOR_GROUPS):
            raise AccessError(_("Your Fares role cannot record business-order payments."))

    def _fu_valid_business_payments(self):
        self.ensure_one()
        return self.sudo().fu_business_payment_ids.filtered(
            lambda payment: payment.move_id.state == "posted"
            and payment.state not in ("canceled", "rejected")
        )

    def _fu_live_business_paid_amount(self):
        self.ensure_one()
        order = self.sudo()
        total = 0.0
        for payment in order._fu_valid_business_payments():
            total += payment.currency_id._convert(
                payment.amount,
                order.currency_id,
                order.company_id,
                payment.date or fields.Date.context_today(order),
            )
        return total

    def _fu_live_business_balance_due(self):
        self.ensure_one()
        order = self.sudo()
        return max(order.amount_total - order._fu_live_business_paid_amount(), 0.0)

    def _fu_has_business_payment(self):
        self.ensure_one()
        return bool(self.sudo()._fu_valid_business_payments())

    @api.depends(
        "amount_total",
        "fu_business_payment_ids.amount",
        "fu_business_payment_ids.state",
        "fu_business_payment_ids.move_id.state",
    )
    def _compute_fu_business_financials(self):
        for order in self:
            if not order.fu_business_order:
                order.fu_business_amount_paid = 0.0
                order.fu_business_balance_due = 0.0
                order.fu_business_payment_state = False
                continue
            paid = order._fu_live_business_paid_amount()
            balance = max(order.amount_total - paid, 0.0)
            order.fu_business_amount_paid = paid
            order.fu_business_balance_due = balance
            if order.currency_id.is_zero(balance):
                order.fu_business_payment_state = "paid"
            elif order.currency_id.compare_amounts(paid, 0.0) > 0:
                order.fu_business_payment_state = "deposit"
            else:
                order.fu_business_payment_state = "unpaid"

    def fu_record_business_payment(
        self,
        amount,
        journal_id,
        payment_method_line_id,
        payment_uuid,
        manual_confirmed=False,
    ):
        self.ensure_one()
        self._fu_assert_business_payment_operator()
        order = self._fu_business_sudo()
        if order.state not in ("draft", "sale"):
            raise ValidationError(_("Business payments may be recorded only on an active draft or confirmed business order."))
        if not order.opportunity_id or order.opportunity_id.fu_sample_state != "approved":
            raise ValidationError(_("An approved sample is required before recording a business payment."))
        lines = order.order_line.filtered(lambda line: not line.display_type and not line.is_downpayment)
        if not lines or order.currency_id.compare_amounts(order.amount_total, 0.0) <= 0:
            raise ValidationError(_("Define positive business-order items before recording a deposit."))

        try:
            amount = float(amount)
        except (TypeError, ValueError):
            raise ValidationError(_("A valid business payment amount is required."))
        payment_uuid = str(payment_uuid or "").strip()
        if not payment_uuid:
            raise ValidationError(_("A stable business payment reference is required."))

        self.env.cr.execute("SELECT id FROM sale_order WHERE id = %s FOR UPDATE", [order.id])

        Payment = self.env["account.payment"].sudo()
        existing = Payment.search([("fu_business_payment_uuid", "=", payment_uuid)], limit=1)
        if existing:
            same_payload = (
                existing.fu_business_order_id == order
                and existing.journal_id.id == int(journal_id)
                and existing.payment_method_line_id.id == int(payment_method_line_id)
                and order.currency_id.compare_amounts(existing.amount, amount) == 0
                and existing.fu_manual_confirmed == bool(manual_confirmed)
            )
            if not same_payload:
                raise ValidationError(_("This business payment reference was already used with different data."))
            return existing.id

        if order.currency_id.compare_amounts(amount, 0.0) <= 0:
            raise ValidationError(_("A business payment amount must be positive."))
        balance = order._fu_live_business_balance_due()
        if order.currency_id.compare_amounts(amount, balance) > 0:
            raise ValidationError(_("A business payment cannot exceed the remaining balance."))

        journal = self.env["account.journal"].sudo().browse(journal_id).exists()
        method_line = self.env["account.payment.method.line"].sudo().browse(
            payment_method_line_id
        ).exists()
        allowed_journal = bool(
            len(journal) == 1
            and journal.company_id == order.company_id
            and (
                journal.type == "cash"
                or (
                    journal.type == "bank"
                    and journal.fu_confirmation_mode == "bank_notification"
                )
            )
        )
        if not allowed_journal:
            raise ValidationError(_("Use an authorized Cash or InstaPay journal for a business payment."))
        if len(method_line) != 1 or method_line not in journal.inbound_payment_method_line_ids:
            raise ValidationError(_("The selected inbound payment method does not belong to this journal."))
        journal_currency = journal.currency_id or journal.company_id.currency_id
        if journal_currency != order.currency_id:
            raise ValidationError(_("The business order and payment journal must use the same currency."))
        if journal.fu_confirmation_mode == "bank_notification" and not manual_confirmed:
            raise ValidationError(
                _("This business payment requires staff confirmation of the bank notification.")
            )

        payment = Payment.with_context(**{_PAYMENT_CONTEXT: True}).create(
            {
                "payment_type": "inbound",
                "partner_type": "customer",
                "partner_id": order.partner_id.id,
                "amount": amount,
                "currency_id": order.currency_id.id,
                "journal_id": journal.id,
                "payment_method_line_id": method_line.id,
                "memo": _("Business order %s", order.name),
                "fu_business_order_id": order.id,
                "fu_business_payment_uuid": payment_uuid,
                "fu_manual_confirmed": bool(manual_confirmed),
                "fu_business_recorded_by_user_id": self.env.user.id,
            }
        )
        payment.action_post()
        order.invalidate_recordset(["fu_business_payment_ids"])
        return payment.id

    def action_fu_open_business_payment(self):
        self.ensure_one()
        self._fu_assert_business_payment_operator()
        order = self._fu_business_sudo()
        if order.state not in ("draft", "sale"):
            raise ValidationError(_("Business payments may be recorded only on an active draft or confirmed order."))
        action = self.env["ir.actions.actions"]._for_xml_id(
            "fu_business.action_fu_business_payment_wizard"
        )
        action["context"] = {"default_order_id": order.id}
        return action


class AccountPayment(models.Model):
    _inherit = "account.payment"

    fu_business_order_id = fields.Many2one(
        "sale.order",
        string="Fares business order",
        copy=False,
        index=True,
        ondelete="restrict",
    )
    fu_business_payment_uuid = fields.Char(
        string="Fares business payment reference",
        copy=False,
        index=True,
    )
    fu_business_recorded_by_user_id = fields.Many2one(
        "res.users",
        string="Business payment recorded by",
        copy=False,
        readonly=True,
        ondelete="restrict",
    )

    _fu_business_payment_uuid_unique = models.UniqueIndex(
        "(fu_business_payment_uuid) WHERE fu_business_payment_uuid IS NOT NULL"
    )

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get("fu_business_order_id") and not _trusted_context(
                self.env, _PAYMENT_CONTEXT
            ):
                raise AccessError(_("Business payments must be created through the controlled Fares payment workflow."))
        return super().create(vals_list)

    @api.constrains("fu_business_order_id", "partner_id", "currency_id", "amount", "state")
    def _check_fu_business_payment_integrity(self):
        for payment in self.filtered("fu_business_order_id"):
            order = payment.fu_business_order_id
            if not order.fu_business_order:
                raise ValidationError(_("A Fares business payment must link to a Fares business order."))
            if payment.partner_id != order.partner_id:
                raise ValidationError(_("A business payment must belong to the business-order customer."))
            if payment.currency_id != order.currency_id:
                raise ValidationError(_("A business payment must use the business-order currency."))
            if order.currency_id.compare_amounts(payment.amount, 0.0) <= 0:
                raise ValidationError(_("A business payment amount must be positive."))

            linked = self.search(
                [
                    ("fu_business_order_id", "=", order.id),
                    ("state", "not in", ["canceled", "rejected"]),
                ]
            )
            total = sum(linked.mapped("amount"))
            if order.currency_id.compare_amounts(total, order.amount_total) > 0:
                raise ValidationError(_("Business payments cannot exceed the whole-order total."))

    @api.constrains("fu_business_order_id", "journal_id", "fu_manual_confirmed")
    def _check_fu_business_bank_notification_confirmation(self):
        for payment in self.filtered("fu_business_order_id"):
            if (
                payment.journal_id.fu_confirmation_mode == "bank_notification"
                and not payment.fu_manual_confirmed
            ):
                raise ValidationError(
                    _("This business payment requires staff confirmation of the bank notification.")
                )

    def write(self, vals):
        business = self.filtered("fu_business_order_id")
        immutable = {
            "fu_business_order_id",
            "fu_business_payment_uuid",
            "fu_business_recorded_by_user_id",
            "partner_id",
            "currency_id",
            "journal_id",
            "payment_method_line_id",
            "amount",
        }
        if vals.get("fu_business_order_id") and not _trusted_context(self.env, _PAYMENT_CONTEXT):
            raise AccessError(_("Business payments must be linked through the controlled Fares payment workflow."))
        if business and immutable.intersection(vals) and not _trusted_context(
            self.env, _PAYMENT_CONTEXT
        ):
            raise ValidationError(_("Recorded business-payment identity and amount cannot be rewritten."))
        return super().write(vals)

    def action_cancel(self):
        if self.filtered("fu_business_order_id"):
            raise ValidationError(
                _("Business payments cannot be cancelled until the B2B refund/credit policy is implemented.")
            )
        return super().action_cancel()

    def action_draft(self):
        if self.filtered("fu_business_order_id"):
            raise ValidationError(
                _("Business payments cannot be reset to draft until the B2B refund/credit policy is implemented.")
            )
        return super().action_draft()

    def unlink(self):
        if self.filtered("fu_business_order_id"):
            raise ValidationError(_("Business payment evidence is retained for auditability."))
        return super().unlink()
