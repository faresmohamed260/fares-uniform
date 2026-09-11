from odoo import _, api, fields, models
from odoo.exceptions import AccessError, ValidationError


_OWNER_GROUP = "fu_core.group_fu_owner_admin"
_SALES_GROUP = "fu_core.group_fu_sales_bd"
_TRANSITION_CONTEXT = "fu_business_transition"
_INTERNAL_CONTEXT = "fu_business_internal"
_COMMERCIAL_CONTEXT = "fu_business_commercial_execution"

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

    @api.model_create_multi
    def create(self, vals_list):
        prepared = []
        for incoming in vals_list:
            vals = dict(incoming)
            if vals.get("fu_business_client") or self.env.context.get("default_fu_business_client"):
                self._fu_assert_business_operator()
                vals["fu_business_client"] = True
                if _SAMPLE_PROTECTED_FIELDS.intersection(vals) - {"fu_business_client"}:
                    if not self.env.context.get(_TRANSITION_CONTEXT):
                        raise AccessError(_("Business sample state and audit fields are system controlled."))
                if not self.env.su and self._fu_is_sales() and not self._fu_is_owner():
                    vals["user_id"] = self.env.user.id
                    vals["company_id"] = self.env.company.id
                    vals["type"] = "opportunity"
            prepared.append(vals)
        return super().create(prepared)

    def write(self, vals):
        business = self.filtered("fu_business_client")
        if business:
            business._fu_assert_business_operator()
            business._fu_assert_business_scope()
            protected = _SAMPLE_PROTECTED_FIELDS.intersection(vals)
            if protected and not self.env.context.get(_TRANSITION_CONTEXT):
                raise AccessError(_("Business sample state and audit fields are system controlled."))
            if not self.env.su and self._fu_is_sales() and not self._fu_is_owner():
                disallowed = set(vals) - _SALES_EDITABLE_FIELDS
                if disallowed:
                    raise AccessError(_("Sales staff cannot change protected business-enquiry fields."))
        return super().write(vals)

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
                ("state", "in", ["draft", "sent"]),
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
            "name": _("Business Quotation"),
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
                if not self.env.context.get(_INTERNAL_CONTEXT):
                    raise AccessError(_("Fares business quotations must be created from an approved business enquiry."))
                vals["fu_business_order"] = True
            prepared.append(vals)
        return super().create(prepared)

    def _fu_business_records(self):
        return self.filtered(
            lambda order: order.fu_business_order
            or bool(order.opportunity_id and order.opportunity_id.fu_business_client)
        )

    def write(self, vals):
        business = self._fu_business_records()
        if business:
            if {"fu_business_order", "opportunity_id"}.intersection(vals) and not self.env.context.get(
                _INTERNAL_CONTEXT
            ):
                raise AccessError(_("Business-order linkage is system controlled."))
            if vals.get("state") not in (None, "draft", "sent") and not self.env.context.get(
                _COMMERCIAL_CONTEXT
            ):
                raise ValidationError(
                    _("Business-order confirmation, shipment and cancellation remain policy-gated in Phase 3B.")
                )
        return super().write(vals)

    def action_confirm(self):
        if self._fu_business_records() and not self.env.context.get(_COMMERCIAL_CONTEXT):
            raise ValidationError(
                _("Business-order confirmation remains blocked until Phase 3B commercial policies are accepted.")
            )
        return super().action_confirm()
