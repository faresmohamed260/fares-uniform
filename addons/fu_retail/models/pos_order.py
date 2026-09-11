from odoo import _, api, fields, models
from odoo.exceptions import AccessError


class PosOrder(models.Model):
    _inherit = "pos.order"

    fu_return_request_id = fields.Many2one(
        "fu.retail.return.request",
        string="Fares return request",
        readonly=True,
        copy=False,
        index=True,
    )

    _FU_RETAIL_SYNC_GROUPS = (
        "fu_core.group_fu_owner_admin",
        "fu_core.group_fu_store_manager",
        "fu_core.group_fu_cashier",
    )

    @api.model
    def _fu_assert_retail_sync_authorized(self):
        if not any(self.env.user.has_group(xmlid) for xmlid in self._FU_RETAIL_SYNC_GROUPS):
            raise AccessError(
                _(
                    "Retail checkout synchronization requires an active Fares Uniform "
                    "Owner, Store Manager, or Cashier role. This transaction remains "
                    "pending and requires review."
                )
            )

    @api.model
    def _fu_get_internal_return_request(self):
        if not self.env.is_superuser() or not self.env.context.get("fu_return_internal"):
            return self.env["fu.retail.return.request"]
        request = self.env["fu.retail.return.request"].browse(
            self.env.context.get("fu_return_request_id")
        ).exists()
        if not request or request.state != "approved":
            return self.env["fu.retail.return.request"]
        return request

    @api.model
    def _fu_payload_contains_refund(self, order):
        if order.get("is_refund"):
            return True
        for line in order.get("lines") or []:
            values = line
            if isinstance(line, (list, tuple)) and len(line) >= 3:
                values = line[2]
            if not isinstance(values, dict):
                continue
            if values.get("refunded_orderline_id"):
                return True
            try:
                if float(values.get("qty") or 0.0) < 0:
                    return True
            except (TypeError, ValueError):
                continue
        return False

    @api.model_create_multi
    def create(self, vals_list):
        internal = self._fu_get_internal_return_request()
        for vals in vals_list:
            if (vals.get("is_refund") or self._fu_payload_contains_refund(vals)) and not internal:
                raise AccessError(
                    _("Retail refunds must be executed through an approved Fares return request.")
                )
            if vals.get("fu_return_request_id") and not internal:
                raise AccessError(_("Return-request linkage is system managed."))
        return super().create(vals_list)

    def write(self, vals):
        if "fu_return_request_id" in vals and not self._fu_get_internal_return_request():
            raise AccessError(_("Return-request linkage is system managed."))
        return super().write(vals)

    def _refund(self):
        request = self._fu_get_internal_return_request()
        if not request or self != request.source_order_id:
            raise AccessError(
                _("Use an approved Fares return request instead of the native refund API.")
            )
        return super()._refund()

    def refund(self):
        request = self._fu_get_internal_return_request()
        if not request or self != request.source_order_id:
            raise AccessError(
                _("Use the Fares return workflow instead of the unrestricted native refund action.")
            )
        return super().refund()

    @api.model
    def sync_from_ui(self, orders):
        if orders:
            self._fu_assert_retail_sync_authorized()
            if any(self._fu_payload_contains_refund(order) for order in orders):
                raise AccessError(
                    _("Offline/native refund synchronization is disabled. Use the online Fares return workflow.")
                )
        return super().sync_from_ui(orders)


class PosOrderLine(models.Model):
    _inherit = "pos.order.line"

    @api.model
    def _fu_internal_return_allowed(self):
        return bool(self.env["pos.order"]._fu_get_internal_return_request())

    @api.model_create_multi
    def create(self, vals_list):
        if not self._fu_internal_return_allowed():
            for vals in vals_list:
                if vals.get("refunded_orderline_id") or (vals.get("qty") or 0) < 0:
                    raise AccessError(
                        _("Refund lines may only be created by an approved Fares return execution.")
                    )
        return super().create(vals_list)

    def write(self, vals):
        if not self._fu_internal_return_allowed():
            if vals.get("refunded_orderline_id") or (
                "qty" in vals and (vals.get("qty") or 0) < 0
            ):
                raise AccessError(
                    _("Refund lines may only be changed by an approved Fares return execution.")
                )
        return super().write(vals)
