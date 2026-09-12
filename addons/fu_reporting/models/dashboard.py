from odoo import _, api, Command, fields, models
from odoo.exceptions import AccessError


class FuReportingDashboard(models.TransientModel):
    _name = "fu.reporting.dashboard"
    _description = "Fares operational reporting dashboard"
    _rec_name = "report_title"

    report_title = fields.Char(compute="_compute_report_title", readonly=True)
    company_id = fields.Many2one("res.company", default=lambda self: self.env.company, readonly=True)
    currency_id = fields.Many2one(related="company_id.currency_id", readonly=True)
    allowed_location_ids = fields.Many2many("stock.location", compute="_compute_allowed_locations")
    location_id = fields.Many2one(
        "stock.location",
        string="Location",
        check_company=True,
        domain="[('id', 'in', allowed_location_ids)]",
    )
    report_date = fields.Date(string="Daily report date", required=True)
    timezone_name = fields.Char(string="Report timezone", readonly=True)
    as_of = fields.Datetime(string="Operational data as of", readonly=True)
    sync_notice = fields.Char(
        string="Offline synchronization note",
        compute="_compute_sync_notice",
        readonly=True,
    )

    sales_gross = fields.Monetary(string="Gross retail sales", currency_field="currency_id", readonly=True)
    sales_refunds = fields.Monetary(string="Retail refunds", currency_field="currency_id", readonly=True)
    sales_net = fields.Monetary(string="Net retail sales", currency_field="currency_id", readonly=True)

    cash_inflow = fields.Monetary(string="Cash inflow", currency_field="currency_id", readonly=True)
    cash_outflow = fields.Monetary(string="Cash refunds / outflow", currency_field="currency_id", readonly=True)
    cash_net = fields.Monetary(string="Cash net", currency_field="currency_id", readonly=True)
    instapay_inflow = fields.Monetary(string="InstaPay inflow", currency_field="currency_id", readonly=True)
    instapay_outflow = fields.Monetary(string="InstaPay refunds / outflow", currency_field="currency_id", readonly=True)
    instapay_net = fields.Monetary(string="InstaPay net", currency_field="currency_id", readonly=True)
    other_payment_net = fields.Monetary(string="Other / unclassified net", currency_field="currency_id", readonly=True)
    other_payment_count = fields.Integer(string="Other / unclassified events", readonly=True)

    low_stock_count = fields.Integer(string="Low-stock warnings", readonly=True)
    upcoming_count = fields.Integer(string="Upcoming orders", readonly=True)
    overdue_count = fields.Integer(string="Overdue orders", readonly=True)
    balance_count = fields.Integer(string="Customers with balance rows", readonly=True)

    low_stock_line_ids = fields.One2many("fu.reporting.low.stock.line", "dashboard_id", readonly=True)
    deadline_line_ids = fields.One2many("fu.reporting.deadline.line", "dashboard_id", readonly=True)
    balance_line_ids = fields.One2many("fu.reporting.balance.line", "dashboard_id", readonly=True)

    @api.depends_context("lang")
    def _compute_report_title(self):
        for dashboard in self:
            dashboard.report_title = _("Operational Reports")

    @api.depends_context("lang")
    def _compute_sync_notice(self):
        for dashboard in self:
            dashboard.sync_notice = dashboard.env._(
                "Server totals exclude offline POS transactions that have not synchronized yet; they become reportable after server reconciliation."
            )

    @api.depends_context("uid", "allowed_company_ids")
    def _compute_allowed_locations(self):
        allowed = self.env["fu.reporting.service"]._fu_allowed_locations()
        for dashboard in self:
            dashboard.allowed_location_ids = allowed

    @api.model
    def default_get(self, fields_list):
        values = super().default_get(fields_list)
        if "report_date" in fields_list and not values.get("report_date"):
            values["report_date"] = self.env["fu.reporting.service"]._fu_default_report_date()
        return values

    @api.model_create_multi
    def create(self, vals_list):
        self.env["fu.reporting.service"]._fu_access_role()
        vals_list = [dict(vals, company_id=self.env.company.id) for vals in vals_list]
        dashboards = super().create(vals_list)
        for dashboard in dashboards:
            dashboard._fu_refresh()
        return dashboards

    def write(self, vals):
        self.env["fu.reporting.service"]._fu_access_role()
        protected = set(vals) - {"report_date", "location_id"}
        if protected and not self.env.context.get("fu_reporting_refresh"):
            raise AccessError(_("Report result fields are system managed; refresh the dashboard instead."))
        return super().write(vals)

    @api.model
    def action_open_dashboard(self):
        self.env["fu.reporting.service"]._fu_access_role()
        dashboard = self.create({})
        view = self.env.ref("fu_reporting.fu_reporting_dashboard_form")
        return {
            "type": "ir.actions.act_window",
            "name": _("Operational Reports"),
            "res_model": self._name,
            "res_id": dashboard.id,
            "view_mode": "form",
            "views": [(view.id, "form")],
            "target": "current",
        }

    def action_refresh(self):
        for dashboard in self:
            dashboard._fu_refresh()
        return True

    def _fu_refresh(self):
        self.ensure_one()
        snapshot = self.env["fu.reporting.service"].fu_get_snapshot(
            report_date=self.report_date,
            location_id=self.location_id.id or None,
            limit=100,
            offset=0,
        )
        cash = snapshot["payments"]["cash"]
        instapay = snapshot["payments"]["instapay"]
        other = snapshot["payments"]["other"]
        deadline_rows = snapshot["upcoming"]["rows"] + snapshot["overdue"]["rows"]
        values = {
            "timezone_name": snapshot["meta"]["timezone"],
            "as_of": fields.Datetime.to_datetime(snapshot["meta"]["as_of"]),
            "sales_gross": snapshot["sales"]["gross"],
            "sales_refunds": snapshot["sales"]["refunds"],
            "sales_net": snapshot["sales"]["net"],
            "cash_inflow": cash["inflow"],
            "cash_outflow": cash["outflow"],
            "cash_net": cash["net"],
            "instapay_inflow": instapay["inflow"],
            "instapay_outflow": instapay["outflow"],
            "instapay_net": instapay["net"],
            "other_payment_net": other["net"],
            "other_payment_count": other["count"],
            "low_stock_count": snapshot["low_stock"]["count"],
            "upcoming_count": snapshot["upcoming"]["count"],
            "overdue_count": snapshot["overdue"]["count"],
            "balance_count": snapshot["balances"]["count"],
            "low_stock_line_ids": [
                Command.clear(),
                *[
                    Command.create(
                        {
                            "product_id": row["product_id"],
                            "location_id": row["location_id"],
                            "available_quantity": row["available_quantity"],
                            "minimum_available_qty": row["minimum_available_qty"],
                            "uom_name": row["uom"],
                        }
                    )
                    for row in snapshot["low_stock"]["rows"]
                ],
            ],
            "deadline_line_ids": [
                Command.clear(),
                *[
                    Command.create(
                        {
                            "bucket": row["bucket"],
                            "kind": row["kind"],
                            "order_ref": row["order"],
                            "customer_name": row["customer"],
                            "deadline": row["deadline"],
                            "balance_due": row["balance_due"],
                            "currency_id": row["currency_id"],
                        }
                    )
                    for row in deadline_rows
                ],
            ],
            "balance_line_ids": [
                Command.clear(),
                *[
                    Command.create(
                        {
                            "kind": row["kind"],
                            "order_ref": row["order"],
                            "customer_name": row["customer"],
                            "deadline": row["deadline"],
                            "balance_due": row["balance_due"],
                            "currency_id": row["currency_id"],
                        }
                    )
                    for row in snapshot["balances"]["rows"]
                ],
            ],
        }
        self.with_context(fu_reporting_refresh=True).write(values)
        return True


class FuReportingLowStockLine(models.TransientModel):
    _name = "fu.reporting.low.stock.line"
    _description = "Fares reporting low-stock line"
    _order = "location_id, product_id"

    dashboard_id = fields.Many2one("fu.reporting.dashboard", required=True, ondelete="cascade")
    product_id = fields.Many2one("product.product", string="Product", readonly=True)
    location_id = fields.Many2one("stock.location", string="Location", readonly=True)
    available_quantity = fields.Float(string="Available", digits="Product Unit", readonly=True)
    minimum_available_qty = fields.Float(string="Warning threshold", digits="Product Unit", readonly=True)
    uom_name = fields.Char(string="Unit", readonly=True)


class FuReportingDeadlineLine(models.TransientModel):
    _name = "fu.reporting.deadline.line"
    _description = "Fares reporting deadline line"
    _order = "deadline, id"

    dashboard_id = fields.Many2one("fu.reporting.dashboard", required=True, ondelete="cascade")
    bucket = fields.Selection([("upcoming", "Upcoming"), ("overdue", "Overdue")], readonly=True)
    kind = fields.Selection([("preorder", "Preorder"), ("business", "Business")], readonly=True)
    order_ref = fields.Char(string="Order", readonly=True)
    customer_name = fields.Char(string="Customer", readonly=True)
    deadline = fields.Datetime(string="Pickup / delivery deadline", readonly=True)
    balance_due = fields.Monetary(string="Balance due", currency_field="currency_id", readonly=True)
    currency_id = fields.Many2one("res.currency", readonly=True)


class FuReportingBalanceLine(models.TransientModel):
    _name = "fu.reporting.balance.line"
    _description = "Fares reporting customer-balance line"
    _order = "customer_name, currency_id, order_ref, id"

    dashboard_id = fields.Many2one("fu.reporting.dashboard", required=True, ondelete="cascade")
    kind = fields.Selection([("preorder", "Preorder"), ("business", "Business")], readonly=True)
    order_ref = fields.Char(string="Order", readonly=True)
    customer_name = fields.Char(string="Customer", readonly=True)
    deadline = fields.Datetime(string="Pickup / delivery deadline", readonly=True)
    balance_due = fields.Monetary(string="Balance due", currency_field="currency_id", readonly=True)
    currency_id = fields.Many2one("res.currency", readonly=True)
