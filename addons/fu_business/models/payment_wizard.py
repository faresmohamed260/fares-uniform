import uuid

from odoo import _, api, fields, models
from odoo.exceptions import ValidationError


def _payment_journals(env):
    journals = env["account.journal"].sudo().search(
        [
            ("company_id", "=", env.company.id),
            ("type", "in", ["cash", "bank"]),
        ],
        order="type,name,id",
    )
    return journals.filtered(
        lambda journal: journal.type == "cash"
        or (
            journal.type == "bank"
            and journal.fu_confirmation_mode == "bank_notification"
        )
    )


def _checked_business_order(env, order_id):
    try:
        order_id = int(order_id)
    except (TypeError, ValueError):
        raise ValidationError(_("A valid Fares business order is required."))
    reference = env["sale.order"].with_user(env.user).browse(order_id)
    reference._fu_assert_business_payment_operator()
    return reference._fu_business_sudo()


def _return_business_order_action(env, order):
    action = env["ir.actions.actions"]._for_xml_id("fu_business.action_fu_business_quotations")
    action.update(
        {
            "res_id": order.id,
            "view_mode": "form",
            "views": [(env.ref("fu_business.fu_business_sale_order_form").id, "form")],
            "target": "current",
        }
    )
    return action


class FuBusinessPaymentWizard(models.TransientModel):
    _name = "fu.business.payment.wizard"
    _description = "Fares Business Order Payment"

    order_id = fields.Many2one(
        "sale.order",
        string="Business Order",
        required=True,
        readonly=True,
    )
    currency_id = fields.Many2one(
        related="order_id.currency_id",
        readonly=True,
    )
    balance_due = fields.Monetary(
        string="Balance Due",
        related="order_id.fu_business_balance_due",
        currency_field="currency_id",
        readonly=True,
    )
    amount = fields.Monetary(
        string="Amount",
        currency_field="currency_id",
        required=True,
        default=0.0,
        help="Enter the negotiated positive deposit or later balance payment. No percentage is preselected.",
    )
    journal_key = fields.Selection(
        selection="_selection_payment_journal",
        string="Payment Method",
        required=True,
        default=lambda self: self._default_journal_key(),
    )
    requires_manual_confirmation = fields.Boolean(
        compute="_compute_requires_manual_confirmation",
    )
    manual_confirmed = fields.Boolean(
        string="I confirm the bank notification was observed",
    )
    payment_uuid = fields.Char(
        string="Payment Reference",
        required=True,
        readonly=True,
        default=lambda self: f"UI-B2B-PAY-{uuid.uuid4()}",
    )

    @api.model
    def default_get(self, fields_list):
        values = super().default_get(fields_list)
        order_id = self.env.context.get("default_order_id")
        if order_id:
            order = _checked_business_order(self.env, order_id)
            values["order_id"] = order.id
        return values

    @api.model
    def _selection_payment_journal(self):
        result = []
        for journal in _payment_journals(self.env):
            if journal.type == "cash":
                label = _("Cash — %s", journal.name)
            else:
                label = _("InstaPay — %s", journal.name)
            result.append((str(journal.id), label))
        return result

    def _default_journal_key(self):
        journals = _payment_journals(self.env)
        cash = journals.filtered(lambda journal: journal.type == "cash")[:1]
        journal = cash or journals[:1]
        return str(journal.id) if journal else False

    def _selected_journal(self):
        self.ensure_one()
        try:
            journal_id = int(self.journal_key)
        except (TypeError, ValueError):
            raise ValidationError(_("Select an authorized business payment method."))
        journal = self.env["account.journal"].sudo().browse(journal_id).exists()
        allowed = (
            len(journal) == 1
            and journal.company_id == self.env.company
            and (
                journal.type == "cash"
                or (
                    journal.type == "bank"
                    and journal.fu_confirmation_mode == "bank_notification"
                )
            )
        )
        if not allowed:
            raise ValidationError(_("Select an authorized Cash or InstaPay journal."))
        return journal

    @api.depends("journal_key")
    def _compute_requires_manual_confirmation(self):
        for wizard in self:
            wizard.requires_manual_confirmation = False
            if not wizard.journal_key:
                continue
            try:
                journal_id = int(wizard.journal_key)
            except (TypeError, ValueError):
                continue
            journal = self.env["account.journal"].sudo().browse(journal_id).exists()
            wizard.requires_manual_confirmation = bool(
                journal
                and journal.type == "bank"
                and journal.fu_confirmation_mode == "bank_notification"
            )

    def action_record_payment(self):
        self.ensure_one()
        order = _checked_business_order(self.env, self.order_id.id)
        journal = self._selected_journal()
        method = journal.inbound_payment_method_line_ids[:1]
        if not method:
            raise ValidationError(_("The selected journal has no inbound payment method."))
        order.with_user(self.env.user).fu_record_business_payment(
            self.amount,
            journal.id,
            method.id,
            self.payment_uuid,
            manual_confirmed=(
                bool(self.manual_confirmed)
                if journal.fu_confirmation_mode == "bank_notification"
                else False
            ),
        )
        return _return_business_order_action(self.env, order)
