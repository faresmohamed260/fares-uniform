from datetime import datetime, time, timedelta

import pytz

from odoo import _, api, fields, models
from odoo.exceptions import AccessError, ValidationError


_OWNER_GROUP = "fu_core.group_fu_owner_admin"
_MANAGER_GROUP = "fu_core.group_fu_store_manager"


class FuReportingStockRule(models.Model):
    _name = "fu.reporting.stock.rule"
    _description = "Fares low-stock warning rule"
    _order = "location_id, product_id"
    _check_company_auto = True

    company_id = fields.Many2one(
        "res.company",
        required=True,
        default=lambda self: self.env.company,
        index=True,
    )
    location_id = fields.Many2one(
        "stock.location",
        required=True,
        index=True,
        check_company=True,
        domain=[("fu_location_role", "in", ["store", "storage"])],
    )
    product_id = fields.Many2one(
        "product.product",
        required=True,
        index=True,
        check_company=True,
        domain=[("is_storable", "=", True)],
    )
    minimum_available_qty = fields.Float(
        string="Low-stock threshold",
        required=True,
        default=0.0,
        digits="Product Unit",
        help="Warn when native available quantity is at or below this amount.",
    )
    active = fields.Boolean(default=True)
    changed_by_id = fields.Many2one(
        "res.users", string="Last changed by", readonly=True, copy=False
    )
    changed_at = fields.Datetime(string="Last changed at", readonly=True, copy=False)

    _identity_unique = models.UniqueIndex("(company_id, location_id, product_id)")
    _threshold_nonnegative = models.Constraint(
        "CHECK (minimum_available_qty >= 0)",
        "Low-stock threshold cannot be negative.",
    )

    @api.model
    def _fu_assert_owner(self):
        if self.env.su or self.env.user.has_group(_OWNER_GROUP):
            return True
        raise AccessError(_("Only Owner / Administrator may manage low-stock warning rules."))

    @api.model_create_multi
    def create(self, vals_list):
        self._fu_assert_owner()
        now = fields.Datetime.now()
        prepared = []
        for incoming in vals_list:
            vals = dict(incoming)
            vals["company_id"] = vals.get("company_id") or self.env.company.id
            company = self.env["res.company"].browse(vals["company_id"]).exists()
            location = self.env["stock.location"].browse(vals.get("location_id")).exists()
            product = self.env["product.product"].browse(vals.get("product_id")).exists()
            if company != self.env.company:
                raise AccessError(_("Low-stock rules may be managed only for the current company."))
            if len(location) != 1 or location.company_id != company or location.fu_location_role not in {"store", "storage"}:
                raise ValidationError(_("Low-stock rules require a current-company Fares Store or Storage location."))
            if len(product) != 1 or not product.is_storable:
                raise ValidationError(_("Low-stock rules require a storable product variant."))
            vals["changed_by_id"] = self.env.user.id
            vals["changed_at"] = now
            prepared.append(vals)
        return super().create(prepared)

    def write(self, vals):
        self._fu_assert_owner()
        protected = dict(vals)
        protected.pop("changed_by_id", None)
        protected.pop("changed_at", None)
        protected.update({"changed_by_id": self.env.user.id, "changed_at": fields.Datetime.now()})
        result = super().write(protected)
        for rule in self:
            if rule.company_id != self.env.company:
                raise AccessError(_("Low-stock rules may be managed only for the current company."))
            if rule.location_id.company_id != rule.company_id or rule.location_id.fu_location_role not in {"store", "storage"}:
                raise ValidationError(_("Low-stock rules require a Fares Store or Storage location."))
            if not rule.product_id.is_storable:
                raise ValidationError(_("Low-stock rules require a storable product variant."))
        return result

    def unlink(self):
        self._fu_assert_owner()
        if any(rule.company_id != self.env.company for rule in self):
            raise AccessError(_("Low-stock rules may be managed only for the current company."))
        return super().unlink()


class FuReportingService(models.AbstractModel):
    _name = "fu.reporting.service"
    _description = "Fares operational reporting service"

    @api.model
    def _fu_access_role(self):
        if self.env.su or self.env.user.has_group(_OWNER_GROUP):
            return "owner"
        if self.env.user.has_group(_MANAGER_GROUP):
            return "manager"
        raise AccessError(_("Your Fares role cannot access operational reports."))

    @api.model
    def _fu_allowed_locations(self):
        role = self._fu_access_role()
        domain = [
            ("company_id", "=", self.env.company.id),
            ("fu_location_role", "in", ["store", "storage"]),
        ]
        locations = self.env["stock.location"].sudo().search(domain, order="fu_location_role, id")
        if role == "owner":
            return locations
        assigned = self.env.user.sudo().fu_stock_location_ids
        return locations.filtered(lambda location: location in assigned and location.fu_location_role == "store")

    @api.model
    def _fu_scoped_locations(self, location_id=None):
        allowed = self._fu_allowed_locations()
        if not location_id:
            return allowed
        try:
            location_id = int(location_id)
        except (TypeError, ValueError):
            raise ValidationError(_("A valid report location is required."))
        selected = allowed.filtered(lambda location: location.id == location_id)
        if len(selected) != 1:
            raise AccessError(_("That report location is outside your authorized scope."))
        return selected

    @api.model
    def _fu_timezone(self):
        name = (self.env.company.partner_id.tz or "UTC").strip() or "UTC"
        try:
            return name, pytz.timezone(name)
        except pytz.UnknownTimeZoneError:
            return "UTC", pytz.UTC

    @api.model
    def _fu_default_report_date(self):
        _name, zone = self._fu_timezone()
        now = fields.Datetime.now()
        aware = pytz.UTC.localize(now) if now.tzinfo is None else now.astimezone(pytz.UTC)
        return aware.astimezone(zone).date()

    @api.model
    def _fu_day_bounds(self, report_date):
        report_date = fields.Date.to_date(report_date) or self._fu_default_report_date()
        _name, zone = self._fu_timezone()
        local_start = zone.localize(datetime.combine(report_date, time.min))
        local_end = zone.localize(datetime.combine(report_date + timedelta(days=1), time.min))
        start = local_start.astimezone(pytz.UTC).replace(tzinfo=None)
        end = local_end.astimezone(pytz.UTC).replace(tzinfo=None)
        return report_date, start, end

    @api.model
    def _fu_company_amount(self, amount, currency, event_date):
        company = self.env.company
        if not currency or currency == company.currency_id:
            return amount
        if isinstance(event_date, datetime):
            event_date = event_date.date()
        event_date = fields.Date.to_date(event_date) or fields.Date.context_today(self)
        return currency._convert(amount, company.currency_id, company, event_date)

    @api.model
    def _fu_pos_configs(self, locations):
        if not locations:
            return self.env["pos.config"]
        return self.env["pos.config"].sudo().search(
            [
                ("company_id", "=", self.env.company.id),
                ("picking_type_id.warehouse_id.lot_stock_id", "in", locations.ids),
            ]
        )

    @api.model
    def _fu_sales_summary(self, report_date, locations):
        _date, start, end = self._fu_day_bounds(report_date)
        configs = self._fu_pos_configs(locations)
        orders = self.env["pos.order"].sudo().search(
            [
                ("company_id", "=", self.env.company.id),
                ("config_id", "in", configs.ids),
                ("state", "in", ["paid", "done"]),
                ("date_order", ">=", start),
                ("date_order", "<", end),
            ]
        )
        gross = refunds = net = 0.0
        for order in orders:
            amount = self._fu_company_amount(order.amount_total, order.currency_id, order.date_order)
            net += amount
            if amount >= 0:
                gross += amount
            else:
                refunds += -amount
        return {"gross": gross, "refunds": refunds, "net": net, "count": len(orders)}

    @api.model
    def _fu_empty_payment_bucket(self):
        return {"inflow": 0.0, "outflow": 0.0, "net": 0.0, "count": 0}

    @api.model
    def _fu_add_payment(self, bucket, amount):
        bucket["count"] += 1
        bucket["net"] += amount
        if amount >= 0:
            bucket["inflow"] += amount
        else:
            bucket["outflow"] += -amount

    @api.model
    def _fu_payment_summary(self, report_date, locations, location_selected):
        report_date, start, end = self._fu_day_bounds(report_date)
        result = {
            "cash": self._fu_empty_payment_bucket(),
            "instapay": self._fu_empty_payment_bucket(),
            "other": self._fu_empty_payment_bucket(),
        }
        configs = self._fu_pos_configs(locations)
        pos_payments = self.env["pos.payment"].sudo().search(
            [
                ("company_id", "=", self.env.company.id),
                ("pos_order_id.config_id", "in", configs.ids),
                ("pos_order_id.state", "in", ["paid", "done"]),
                ("is_change", "=", False),
                ("payment_date", ">=", start),
                ("payment_date", "<", end),
            ]
        )
        for payment in pos_payments:
            method = payment.payment_method_id
            if method.is_cash_count:
                key = "cash"
            elif method.fu_confirmation_mode == "bank_notification":
                key = "instapay"
            else:
                key = "other"
            signed = self._fu_company_amount(
                payment.amount, payment.currency_id, payment.payment_date
            )
            self._fu_add_payment(result[key], signed)

        account_payments = self.env["account.payment"].sudo().search(
            [
                ("company_id", "=", self.env.company.id),
                ("date", "=", report_date),
                ("move_id.state", "=", "posted"),
                ("state", "not in", ["canceled", "rejected"]),
                "|",
                ("fu_preorder_id", "!=", False),
                ("fu_business_order_id", "!=", False),
            ]
        )
        role = self._fu_access_role()
        allowed_store_ids = locations.filtered(lambda location: location.fu_location_role == "store").ids
        for payment in account_payments:
            if payment.fu_preorder_id:
                if payment.fu_preorder_id.fu_store_location_id.id not in allowed_store_ids:
                    continue
            elif payment.fu_business_order_id:
                if role != "owner" or location_selected:
                    continue
            journal = payment.journal_id
            if journal.type == "cash":
                key = "cash"
            elif journal.type == "bank" and journal.fu_confirmation_mode == "bank_notification":
                key = "instapay"
            else:
                key = "other"
            amount = self._fu_company_amount(payment.amount, payment.currency_id, payment.date)
            if payment.payment_type == "outbound":
                amount = -amount
            self._fu_add_payment(result[key], amount)
        return result

    @api.model
    def _fu_low_stock_rows(self, locations):
        Rule = self.env["fu.reporting.stock.rule"].sudo()
        rules = Rule.search(
            [
                ("company_id", "=", self.env.company.id),
                ("active", "=", True),
                ("location_id", "in", locations.ids),
            ]
        )
        rows = []
        Quant = self.env["stock.quant"].sudo()
        for rule in rules:
            available = Quant._get_available_quantity(
                rule.product_id, rule.location_id, strict=False
            )
            if rule.product_id.uom_id.compare(available, rule.minimum_available_qty) <= 0:
                rows.append(
                    {
                        "product_id": rule.product_id.id,
                        "product": rule.product_id.display_name,
                        "location_id": rule.location_id.id,
                        "location": rule.location_id.display_name,
                        "available_quantity": available,
                        "minimum_available_qty": rule.minimum_available_qty,
                        "uom": rule.product_id.uom_id.display_name,
                    }
                )
        rows.sort(key=lambda row: (row["location"].casefold(), row["product"].casefold(), row["product_id"]))
        return rows

    @api.model
    def _fu_business_complete(self, order):
        customer = order.picking_ids.filtered(
            lambda picking: picking.location_dest_id.usage == "customer" and picking.state != "cancel"
        )
        return bool(customer) and all(picking.state == "done" for picking in customer)

    @api.model
    def _fu_deadline_rows(self, locations, location_selected, as_of):
        role = self._fu_access_role()
        rows = []
        store_ids = locations.filtered(lambda location: location.fu_location_role == "store").ids
        preorders = self.env["sale.order"].sudo().search(
            [
                ("company_id", "=", self.env.company.id),
                ("fu_is_preorder", "=", True),
                ("state", "!=", "cancel"),
                ("commitment_date", "!=", False),
                ("fu_store_location_id", "in", store_ids),
            ]
        )
        for order in preorders:
            if order.fu_collection_state == "collected":
                continue
            rows.append(self._fu_deadline_row(order, "preorder", as_of))

        if role == "owner" and not location_selected:
            business = self.env["sale.order"].sudo().search(
                [
                    ("company_id", "=", self.env.company.id),
                    ("fu_business_order", "=", True),
                    ("state", "=", "sale"),
                    ("commitment_date", "!=", False),
                ]
            )
            for order in business:
                if not self._fu_business_complete(order):
                    rows.append(self._fu_deadline_row(order, "business", as_of))

        rows.sort(key=lambda row: (row["deadline"], row["kind"], row["order_id"]))
        return rows

    @api.model
    def _fu_deadline_row(self, order, kind, as_of):
        balance = order.fu_balance_due if kind == "preorder" else order.fu_business_balance_due
        return {
            "order_id": order.id,
            "order": order.name,
            "kind": kind,
            "customer": order.partner_id.display_name,
            "deadline": order.commitment_date,
            "bucket": "overdue" if order.commitment_date < as_of else "upcoming",
            "balance_due": balance,
            "currency_id": order.currency_id.id,
            "currency": order.currency_id.name,
        }

    @api.model
    def _fu_balance_rows(self, locations, location_selected):
        role = self._fu_access_role()
        rows = []
        store_ids = locations.filtered(lambda location: location.fu_location_role == "store").ids
        preorders = self.env["sale.order"].sudo().search(
            [
                ("company_id", "=", self.env.company.id),
                ("fu_is_preorder", "=", True),
                ("state", "!=", "cancel"),
                ("fu_store_location_id", "in", store_ids),
            ]
        )
        for order in preorders:
            balance = order._fu_live_balance_due()
            if order.currency_id.compare_amounts(balance, 0.0) > 0:
                rows.append(self._fu_balance_row(order, "preorder", balance))

        if role == "owner" and not location_selected:
            business = self.env["sale.order"].sudo().search(
                [
                    ("company_id", "=", self.env.company.id),
                    ("fu_business_order", "=", True),
                    ("state", "in", ["draft", "sale"]),
                ]
            )
            for order in business:
                if order.state == "draft" and not order._fu_has_business_payment():
                    continue
                balance = order._fu_live_business_balance_due()
                if order.currency_id.compare_amounts(balance, 0.0) > 0:
                    rows.append(self._fu_balance_row(order, "business", balance))

        rows.sort(key=lambda row: (row["customer"].casefold(), row["currency"], row["order"], row["order_id"]))
        return rows

    @api.model
    def _fu_balance_row(self, order, kind, balance):
        return {
            "order_id": order.id,
            "order": order.name,
            "kind": kind,
            "customer": order.partner_id.display_name,
            "deadline": order.commitment_date,
            "balance_due": balance,
            "currency_id": order.currency_id.id,
            "currency": order.currency_id.name,
        }

    @api.model
    def fu_get_snapshot(self, report_date=None, location_id=None, limit=50, offset=0):
        role = self._fu_access_role()
        try:
            limit = int(limit)
            offset = int(offset)
        except (TypeError, ValueError):
            raise ValidationError(_("Report pagination values must be integers."))
        if limit < 1 or limit > 100 or offset < 0:
            raise ValidationError(_("Report page size must be 1–100 and offset cannot be negative."))

        report_date = fields.Date.to_date(report_date) or self._fu_default_report_date()
        locations = self._fu_scoped_locations(location_id)
        location_selected = bool(location_id)
        timezone_name, _zone = self._fu_timezone()
        as_of = fields.Datetime.now()
        sales = self._fu_sales_summary(report_date, locations)
        payments = self._fu_payment_summary(report_date, locations, location_selected)
        low_stock = self._fu_low_stock_rows(locations)
        deadlines = self._fu_deadline_rows(locations, location_selected, as_of)
        balances = self._fu_balance_rows(locations, location_selected)
        upcoming = [row for row in deadlines if row["bucket"] == "upcoming"]
        overdue = [row for row in deadlines if row["bucket"] == "overdue"]

        return {
            "meta": {
                "role": role,
                "report_date": fields.Date.to_string(report_date),
                "timezone": timezone_name,
                "as_of": fields.Datetime.to_string(as_of),
                "company": self.env.company.display_name,
                "company_currency_id": self.env.company.currency_id.id,
                "company_currency": self.env.company.currency_id.name,
                "location": locations.display_name if len(locations) == 1 else False,
                "sync_notice": _(
                    "Server totals exclude offline POS transactions that have not synchronized yet; they become reportable after server reconciliation."
                ),
            },
            "sales": sales,
            "payments": payments,
            "low_stock": {"count": len(low_stock), "rows": low_stock[offset : offset + limit]},
            "upcoming": {"count": len(upcoming), "rows": upcoming[offset : offset + limit]},
            "overdue": {"count": len(overdue), "rows": overdue[offset : offset + limit]},
            "balances": {"count": len(balances), "rows": balances[offset : offset + limit]},
        }
