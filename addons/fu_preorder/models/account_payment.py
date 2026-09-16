from odoo import _, api, fields, models
from odoo.exceptions import ValidationError


class AccountPayment(models.Model):
    _inherit = "account.payment"

    fu_preorder_id = fields.Many2one(
        "sale.order",
        string="Fares preorder",
        copy=False,
        index=True,
        ondelete="restrict",
    )
    fu_preorder_payment_uuid = fields.Char(
        string="Fares preorder payment UUID",
        copy=False,
        index=True,
    )
    fu_manual_confirmed = fields.Boolean(
        string="Fares manual bank-notification confirmation",
        copy=False,
        readonly=False,
    )
    fu_recorded_by_user_id = fields.Many2one(
        "res.users",
        string="Fares recorded by",
        copy=False,
        readonly=True,
        ondelete="restrict",
    )
    fu_payment_kind = fields.Selection(
        [
            ("cash", "Cash"),
            ("instapay", "InstaPay"),
            ("bank", "Bank"),
        ],
        string="Fares payment method",
        compute="_compute_fu_payment_kind",
    )

    _fu_preorder_payment_uuid_unique = models.UniqueIndex(
        "(fu_preorder_payment_uuid) WHERE fu_preorder_payment_uuid IS NOT NULL"
    )

    @api.depends("fu_preorder_id", "journal_id.type", "journal_id.fu_confirmation_mode")
    def _compute_fu_payment_kind(self):
        for payment in self:
            if not payment.fu_preorder_id:
                payment.fu_payment_kind = False
                continue
            journal = payment.sudo().journal_id
            if journal.type == "cash":
                payment.fu_payment_kind = "cash"
            elif journal.type == "bank" and journal.fu_confirmation_mode == "bank_notification":
                payment.fu_payment_kind = "instapay"
            elif journal.type == "bank":
                payment.fu_payment_kind = "bank"
            else:
                payment.fu_payment_kind = False

    @api.constrains("fu_preorder_id", "partner_id", "currency_id", "amount", "state")
    def _check_fu_preorder_payment_integrity(self):
        for payment in self.filtered("fu_preorder_id"):
            order = payment.fu_preorder_id
            if payment.partner_id != order.partner_id:
                raise ValidationError(_("A preorder payment must belong to the preorder customer."))
            if payment.currency_id != order.currency_id:
                raise ValidationError(_("A preorder payment must use the preorder currency."))
            if order.currency_id.compare_amounts(payment.amount, 0.0) <= 0:
                raise ValidationError(_("A preorder payment amount must be positive."))

            linked = self.search(
                [
                    ("fu_preorder_id", "=", order.id),
                    ("state", "not in", ["canceled", "rejected"]),
                ]
            )
            total = sum(linked.mapped("amount"))
            if order.currency_id.compare_amounts(total, order.amount_total) > 0:
                raise ValidationError(_("Preorder payments cannot exceed the whole-order total."))

    @api.constrains("fu_preorder_id", "journal_id", "fu_manual_confirmed")
    def _check_fu_bank_notification_confirmation(self):
        for payment in self.filtered("fu_preorder_id"):
            if (
                payment.journal_id.fu_confirmation_mode == "bank_notification"
                and not payment.fu_manual_confirmed
            ):
                raise ValidationError(
                    _("This preorder payment requires staff confirmation of the bank notification.")
                )

    def write(self, vals):
        if vals.get("fu_manual_confirmed") is False and any(self.mapped("fu_manual_confirmed")):
            raise ValidationError(_("Recorded bank-notification confirmation cannot be cleared."))
        return super().write(vals)
