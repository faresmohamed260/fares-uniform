from odoo import _, api, fields, models
from odoo.exceptions import AccessError, ValidationError


_OWNER_GROUP = "fu_core.group_fu_owner_admin"
_SALES_GROUP = "fu_core.group_fu_sales_bd"
_TRANSITION_CONTEXT = "fu_business_transition"
_INTERNAL_CONTEXT = "fu_business_internal"
_COMMERCIAL_CONTEXT = "fu_business_commercial_execution"
_NO_PARTNER_SYNC_CONTEXT = "fu_business_no_partner_sync"

_SAMPLE_PROTECTED_FIELDS = {
    "fu_business_client",
    "fu_sample_state",
    "fu_sample_sent_by_id",
    "fu_sample_sent_at",
    "fu_sample_decided_by_id",
    "fu_sample_decided_at",
}

_SALES_EDITABLE_FIELDS = {
    "name",
    "partner_id",
    "partner_name",
    "contact_name",
    "email_from",
    "phone",
    "mobile",
    "description",
    "date_deadline",
    "fu_design_requirements",
    "fu_sample_reference",
    "fu_sample_notes",
}

_BUSINESS_LINK_FIELDS = {"fu_business_order", "opportunity_id"}
_BUSINESS_AUDIT_FIELDS = {
    "fu_business_confirmed_by_id",
    "fu_business_confirmed_at",
    "fu_business_change_approved_by_id",
    "fu_business_change_approved_at",
}
_BUSINESS_COMMERCIAL_FIELDS = {
    "partner_id",
    "client_order_ref",
    "commitment_date",
    "order_line",
    "pricelist_id",
    "currency_id",
    "payment_term_id",
}


def _trusted_context(env, key):
    """Internal context flags are valid only with sudo execution.

    RPC callers can supply arbitrary context values, so a context flag by itself
    must never authorize a protected Fares transition.
    """
    return bool(env.su and env.context.get(key))


class CrmLead(models.Model):
    _inherit = "crm.lead"

    fu_business_client = fields.Boolean(
        string="Fares business client",
        default=False,
        copy=False,
        index=True,
    )
    fu_design_requirements = fields.Text(
        string="Design requirements",
        tracking=True,
    )
    fu_sample_state = fields.Selection(
        [
            ("not_started", "Not started"),
            ("preparing", "Preparing"),
            ("sent", "Sent"),
            ("revision", "Revision requested"),
            ("approved", "Approved"),
            ("rejected", "Rejected"),
        ],
        string="Sample status",
        default="not_started",
        required=True,
        tracking=True,
        copy=False,
        index=True,
    )
    fu_sample_reference = fields.Char(
        string="Sample reference",
        tracking=True,
        copy=False,
    )
    fu_sample_notes = fields.Text(
        string="Sample notes",
        tracking=True,
        copy=False,
    )
    fu_sample_sent_by_id = fields.Many2one(
        "res.users",
        string="Sample sent by",
        readonly=True,
        copy=False,
    )
    fu_sample_sent_at = fields.Datetime(
        string="Sample sent at",
        readonly=True,
        copy=False,
    )
    fu_sample_decided_by_id = fields.Many2one(
        "res.users",
        string="Sample decided by",
        readonly=True,
        copy=False,
    )
    fu_sample_decided_at = fields.Datetime(
        string="Sample decided at",
        readonly=True,
        copy=False,
    )

    def _fu_is_owner(self):
        return self.env.user.has_group(_OWNER_GROUP)

    def _fu_is_sales(self):
        return self.env.user.has_group(_SALES_GROUP)

    def _fu_assert_business_operator(self):
        if self.env.su:
            return
        if not (self._fu_is_owner() or self._fu_is_sales()):
            raise AccessError(_("Your Fares role cannot manage business-client enquiries."))

    def _fu_assert_business_scope(self):
        if self.env.su or self._fu_is_owner():
            return
        if not self._fu_is_sales():
            raise AccessError(_("Your Fares role cannot manage business-client enquiries."))
        if any(lead.user_id != self.env.user for lead in self):
            raise AccessError(_("Sales staff may manage only their assigned business enquiries."))

    def _get_partner_email_update(self, force_void=True):
        self.ensure_one()
        if self.fu_business_client and self.env.context.get(_NO_PARTNER_SYNC_CONTEXT):
            return False
        return super()._get_partner_email_update(force_void=force_void)

    def _get_partner_phone_update(self, force_void=True):
        self.ensure_one()
        if self.fu_business_client and self.env.context.get(_NO_PARTNER_SYNC_CONTEXT):
            return False
        return super()._get_partner_phone_update(force_void=force_void)

    @api.model_create_multi
    def create(self, vals_list):
        prepared = []
        sales_business_create = False
        for incoming in vals_list:
            vals = dict(incoming)
            if vals.get("fu_business_client") or self.env.context.get("default_fu_business_client"):
                self._fu_assert_business_operator()
                vals["fu_business_client"] = True
                protected = _SAMPLE_PROTECTED_FIELDS.intersection(vals) - {"fu_business_client"}
                if protected and not _trusted_context(self.env, _TRANSITION_CONTEXT):
                    raise AccessError(_("Business sample state and audit fields are system controlled."))
                if not self.env.su and self._fu_is_sales() and not self._fu_is_owner():
                    vals["user_id"] = self.env.user.id
                    vals["company_id"] = self.env.company.id
                    vals["type"] = "opportunity"
                    sales_business_create = True
            prepared.append(vals)
        create_self = self
        if sales_business_create:
            create_self = self.with_context(**{_NO_PARTNER_SYNC_CONTEXT: True})
        return super(CrmLead, create_self).create(prepared)

    def write(self, vals):
        business = self.filtered("fu_business_client")
        sales_business_write = False
        if business:
            business._fu_assert_business_operator()
            business._fu_assert_business_scope()
            protected = _SAMPLE_PROTECTED_FIELDS.intersection(vals)
            if protected and not _trusted_context(self.env, _TRANSITION_CONTEXT):
                raise AccessError(_("Business sample state and audit fields are system controlled."))
            if not self.env.su and self._fu_is_sales() and not self._fu_is_owner():
                disallowed = set(vals) - _SALES_EDITABLE_FIELDS
                if disallowed:
                    raise AccessError(_("Sales staff cannot change protected business-enquiry fields."))
                sales_business_write = True
        write_self = self
        if sales_business_write:
            write_self = self.with_context(**{_NO_PARTNER_SYNC_CONTEXT: True})
        return super(CrmLead, write_self).write(vals)

    def unlink(self):
        if self.filtered("fu_business_client"):
            raise AccessError(_("Business enquiries are retained for auditability."))
        return super().unlink()

    def _fu_transition_sample(self, target, allowed_from):
        self.ensure_one()
        if not self.fu_business_client:
            raise ValidationError(_("This action is only available for Fares business enquiries."))
        self._fu_assert_business_operator()
        self._fu_assert_business_scope()
        if self.fu_sample_state not in allowed_from:
            raise ValidationError(
                _(
                    "Sample status cannot move from %(source)s to %(target)s.",
                    source=self.fu_sample_state,
                    target=target,
                )
            )
        vals = {"fu_sample_state": target}
        now = fields.Datetime.now()
        if target == "sent":
            vals.update(
                {
                    "fu_sample_sent_by_id": self.env.user.id,
                    "fu_sample_sent_at": now,
                }
            )
        if target in {"approved", "rejected"}:
            vals.update(
                {
                    "fu_sample_decided_by_id": self.env.user.id,
                    "fu_sample_decided_at": now,
                }
            )
        self.sudo().with_context(**{_TRANSITION_CONTEXT: True}).write(vals)
        return True

    def action_fu_prepare_sample(self):
        for lead in self:
            lead._fu_transition_sample("preparing", {"not_started", "revision"})
        return True

    def action_fu_mark_sample_sent(self):
        for lead in self:
            lead._fu_transition_sample("sent", {"preparing"})
        return True

    def action_fu_request_revision(self):
        for lead in self:
            lead._fu_transition_sample("revision", {"sent"})
        return True

    def action_fu_approve_sample(self):
        for lead in self:
            lead._fu_transition_sample("approved", {"sent"})
        return True

    def action_fu_reject_sample(self):
        for lead in self:
            lead._fu_transition_sample("rejected", {"sent"})
        return True

    def action_fu_create_business_quotation(self):
        self.ensure_one()
        if not self.fu_business_client:
            raise ValidationError(_("This action is only available for Fares business enquiries."))
        self._fu_assert_business_operator()
        self._fu_assert_business_scope()
        if self.fu_sample_state != "approved":
            raise ValidationError(_("Approve the sample before preparing a business quotation."))

        self.env.cr.execute(
            "SELECT pg_advisory_xact_lock(hashtext(%s), %s)",
            ["fu_business_draft_quotation", self.id],
        )
        order = self.env["sale.order"].sudo().search(
            [
                ("opportunity_id", "=", self.id),
                ("fu_business_order", "=", True),
                ("state", "in", ["draft", "sent", "sale"]),
            ],
            order="id",
            limit=1,
        )
        if not order:
            lead = self.sudo()
            if not lead.partner_id:
                partner = lead._create_customer()
                lead.with_context(**{_INTERNAL_CONTEXT: True}).write({"partner_id": partner.id})
            order = self.env["sale.order"].sudo().with_context(
                **{_INTERNAL_CONTEXT: True}
            ).create(
                {
                    "partner_id": lead.partner_id.id,
                    "opportunity_id": lead.id,
                    "company_id": lead.company_id.id or self.env.company.id,
                    "user_id": lead.user_id.id or self.env.user.id,
                    "fu_business_order": True,
                }
            )
        view = self.env.ref("fu_business.fu_business_sale_order_form")
        return {
            "type": "ir.actions.act_window",
            "name": self.env._("Business Order"),
            "res_model": "sale.order",
            "res_id": order.id,
            "view_mode": "form",
            "views": [(view.id, "form")],
            "target": "current",
        }


class SaleOrder(models.Model):
    _inherit = "sale.order"

    fu_business_order = fields.Boolean(
        string="Fares business order",
        default=False,
        copy=False,
        index=True,
        readonly=True,
    )
    fu_business_confirmed_by_id = fields.Many2one(
        "res.users",
        string="Business order confirmed by",
        readonly=True,
        copy=False,
    )
    fu_business_confirmed_at = fields.Datetime(
        string="Business order confirmed at",
        readonly=True,
        copy=False,
    )
    fu_business_change_approved_by_id = fields.Many2one(
        "res.users",
        string="Last commercial change approved by",
        readonly=True,
        copy=False,
    )
    fu_business_change_approved_at = fields.Datetime(
        string="Last commercial change approved at",
        readonly=True,
        copy=False,
    )

    @api.model_create_multi
    def create(self, vals_list):
        prepared = []
        for incoming in vals_list:
            vals = dict(incoming)
            opportunity = self.env["crm.lead"].browse(vals.get("opportunity_id")).exists()
            is_business = bool(vals.get("fu_business_order")) or bool(
                opportunity and opportunity.fu_business_client
            )
            if is_business:
                if not _trusted_context(self.env, _INTERNAL_CONTEXT):
                    raise AccessError(_("Fares business quotations must be created from an approved business enquiry."))
                vals["fu_business_order"] = True
            prepared.append(vals)
        return super().create(prepared)

    def _fu_business_records(self):
        return self.filtered(
            lambda order: order.fu_business_order
            or bool(order.opportunity_id and order.opportunity_id.fu_business_client)
        )

    def _fu_assert_business_operator(self):
        if self.env.su or self.env.user.has_group(_OWNER_GROUP):
            return
        if not self.env.user.has_group(_SALES_GROUP):
            raise AccessError(_("Your Fares role cannot manage business quotations."))

    def _fu_assert_business_scope(self):
        self._fu_assert_business_operator()
        if self.env.su or self.env.user.has_group(_OWNER_GROUP):
            return
        if any(order.opportunity_id.user_id != self.env.user for order in self):
            raise AccessError(_("Sales staff may manage only quotations for their assigned business enquiries."))

    def _fu_assert_draft_editor_access(self):
        self.ensure_one()
        if not self._fu_business_records():
            raise ValidationError(_("This action is only available for Fares business quotations."))
        self._fu_assert_business_scope()
        if self.state != "draft":
            raise ValidationError(_("Only draft Fares business quotations may be edited here."))
        if not self.opportunity_id or self.opportunity_id.fu_sample_state != "approved":
            raise ValidationError(_("An approved sample is required before editing draft quotation details."))
        if self._fu_has_business_payment() and not self.env.user.has_group(_OWNER_GROUP):
            raise AccessError(_("Post-payment commercial changes require Owner/Admin approval."))
        return True

    def _fu_assert_ready_for_confirmation(self):
        self.ensure_one()
        if self.state != "draft":
            raise ValidationError(_("Only a draft Fares business quotation may be confirmed."))
        if not self.opportunity_id or self.opportunity_id.fu_sample_state != "approved":
            raise ValidationError(_("An approved sample is required before business-order confirmation."))
        lines = self.order_line.filtered(lambda line: not line.display_type and not line.is_downpayment)
        if not lines:
            raise ValidationError(_("Add at least one business-order item before confirmation."))
        for line in lines:
            if not line.product_id or not line.product_id.sale_ok or not line.product_id.is_storable:
                raise ValidationError(_("Business-order items must be sellable finished-stock products."))
            if line.product_uom_id.compare(line.product_uom_qty, 0.0) <= 0:
                raise ValidationError(_("Business-order item quantities must be positive."))
        if not self.commitment_date:
            raise ValidationError(_("A business-order delivery date is required before confirmation."))
        if self.currency_id.compare_amounts(self._fu_live_business_paid_amount(), 0.0) <= 0:
            raise ValidationError(_("Record a positive negotiated deposit before confirming the business order."))
        return True

    def action_fu_confirm_business_order(self):
        self.ensure_one()
        self._fu_assert_business_scope()
        self._fu_assert_ready_for_confirmation()
        actor_id = self.env.user.id
        order = self.sudo().with_context(**{_COMMERCIAL_CONTEXT: True})
        order.action_confirm()
        order.with_context(**{_INTERNAL_CONTEXT: True}).write(
            {
                "fu_business_confirmed_by_id": actor_id,
                "fu_business_confirmed_at": fields.Datetime.now(),
            }
        )
        return True

    def action_fu_cancel_business_draft(self):
        self.ensure_one()
        self._fu_assert_business_scope()
        if self.state != "draft":
            raise ValidationError(_("Only an unpaid draft business order may be cancelled in this MVP."))
        if self._fu_has_business_payment():
            raise ValidationError(_("A business order with recorded money cannot be cancelled until B2B refund/credit policy is implemented."))
        self.sudo().with_context(**{_COMMERCIAL_CONTEXT: True}).action_cancel()
        return True

    def write(self, vals):
        business = self._fu_business_records()
        incoming_opportunity = self.env["crm.lead"]
        if vals.get("opportunity_id"):
            incoming_opportunity = self.env["crm.lead"].browse(vals["opportunity_id"]).exists()
        becoming_business = bool(vals.get("fu_business_order")) or bool(
            incoming_opportunity and incoming_opportunity.fu_business_client
        )
        trusted_internal = _trusted_context(self.env, _INTERNAL_CONTEXT)
        trusted_commercial = _trusted_context(self.env, _COMMERCIAL_CONTEXT)
        trusted = trusted_internal or trusted_commercial

        if becoming_business and not trusted_internal:
            raise AccessError(_("Business-order linkage is system controlled."))
        if business:
            if _BUSINESS_LINK_FIELDS.intersection(vals) and not trusted_internal:
                raise AccessError(_("Business-order linkage is system controlled."))
            if _BUSINESS_AUDIT_FIELDS.intersection(vals) and not trusted_internal:
                raise AccessError(_("Business-order audit fields are system controlled."))
            if _BUSINESS_COMMERCIAL_FIELDS.intersection(vals) and not trusted:
                raise AccessError(_("Business commercial terms must be changed through the controlled Fares workflow."))
            if "state" in vals and not trusted:
                raise ValidationError(_("Business-order state transitions must use the controlled Fares workflow."))
            if self.filtered(lambda order: order.state != "draft") and _BUSINESS_COMMERCIAL_FIELDS.intersection(vals):
                raise ValidationError(_("Confirmed business-order commercial terms cannot be changed in this MVP."))
        return super().write(vals)

    def action_confirm(self):
        business = self._fu_business_records()
        if business and not _trusted_context(self.env, _COMMERCIAL_CONTEXT):
            raise ValidationError(_("Business-order confirmation must use the controlled Fares confirmation action."))
        return super().action_confirm()

    def action_cancel(self):
        business = self._fu_business_records()
        if business:
            if not _trusted_context(self.env, _COMMERCIAL_CONTEXT):
                raise ValidationError(_("Business-order cancellation must use the controlled Fares workflow."))
            if any(order._fu_has_business_payment() for order in business):
                raise ValidationError(_("A business order with recorded money cannot be cancelled until B2B refund/credit policy is implemented."))
            if any(order.state not in ("draft", "sent") for order in business):
                raise ValidationError(_("Confirmed business orders cannot be cancelled in this MVP."))
        return super().action_cancel()


class SaleOrderLine(models.Model):
    _inherit = "sale.order.line"

    @api.model_create_multi
    def create(self, vals_list):
        trusted = _trusted_context(self.env, _INTERNAL_CONTEXT) or _trusted_context(
            self.env, _COMMERCIAL_CONTEXT
        )
        if not trusted:
            for vals in vals_list:
                order = self.env["sale.order"].browse(vals.get("order_id")).exists()
                if order and order._fu_business_records():
                    raise AccessError(_("Business-order lines must be changed through the controlled Fares workflow."))
        return super().create(vals_list)

    def write(self, vals):
        business_lines = self.filtered(lambda line: line.order_id._fu_business_records())
        trusted = _trusted_context(self.env, _INTERNAL_CONTEXT) or _trusted_context(
            self.env, _COMMERCIAL_CONTEXT
        )
        if business_lines and not trusted:
            raise AccessError(_("Business-order lines must be changed through the controlled Fares workflow."))
        if business_lines.filtered(lambda line: line.order_id.state != "draft") and not _trusted_context(
            self.env, _COMMERCIAL_CONTEXT
        ):
            raise ValidationError(_("Confirmed business-order lines cannot be changed in this MVP."))
        return super().write(vals)

    def unlink(self):
        business_lines = self.filtered(lambda line: line.order_id._fu_business_records())
        trusted = _trusted_context(self.env, _INTERNAL_CONTEXT) or _trusted_context(
            self.env, _COMMERCIAL_CONTEXT
        )
        if business_lines and not trusted:
            raise AccessError(_("Business-order lines must be changed through the controlled Fares workflow."))
        if business_lines.filtered(lambda line: line.order_id.state != "draft"):
            raise ValidationError(_("Confirmed business-order lines cannot be removed in this MVP."))
        return super().unlink()
