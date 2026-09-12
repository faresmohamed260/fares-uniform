from odoo import Command
from odoo.tests import HttpCase, tagged

from odoo.addons.fu_core.tests.visual_capture import capture_views, install_arabic


@tagged("post_install", "-at_install")
class TestFaresReportingBilingualUI(HttpCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.admin = cls.env.ref("base.user_admin")
        cls.admin.write(
            {"group_ids": [Command.link(cls.env.ref("fu_core.group_fu_owner_admin").id)]}
        )
        cls.env.company.partner_id.tz = False

    def _set_language(self, arabic):
        if arabic:
            install_arabic(self.env, self.admin)
        else:
            self.admin.lang = "en_US"

    def _dashboard_action(self):
        dashboard = self.env["fu.reporting.dashboard"].with_user(self.admin).create({})
        return self.env["ir.actions.act_window"].sudo().create(
            {
                "name": "Phase 4B reporting evidence",
                "res_model": "fu.reporting.dashboard",
                "view_mode": "form",
                "view_id": self.env.ref("fu_reporting.fu_reporting_dashboard_form").id,
                "res_id": dashboard.id,
                "target": "current",
            }
        )

    def _show_dashboard(self, arabic=False):
        self._set_language(arabic)
        action = self._dashboard_action()
        expected_title = "التقارير التشغيلية" if arabic else "Operational Reports"
        expected_sales = "مبيعات التجزئة اليومية" if arabic else "Daily retail sales"
        expected_sync = (
            "تنبيه مزامنة العمل دون اتصال"
            if arabic
            else "Offline sync disclosure"
        )
        expected_sync_body = (
            "تستبعد إجماليات الخادم معاملات نقطة البيع غير المتصلة التي لم تتم مزامنتها بعد؛ وتظهر في التقارير بعد تسويتها على الخادم."
            if arabic
            else "Server totals exclude offline POS transactions that have not synchronized yet; they become reportable after server reconciliation."
        )
        expected_refresh = "تحديث التقارير" if arabic else "Refresh reports"
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
                if (!form.innerText.includes({expected_title!r})) throw new Error('Localized reporting title missing');
                if (!form.innerText.includes({expected_sales!r})) throw new Error('Localized daily-sales section missing');
                if (!form.innerText.includes({expected_sync!r})) throw new Error('Offline synchronization disclosure missing');
                if (!form.innerText.includes({expected_sync_body!r})) throw new Error('Localized offline synchronization body missing');
                if (!form.innerText.includes('UTC')) throw new Error('Explicit report timezone missing');
                const refresh = await waitFor('button[name="action_refresh"]');
                if (!refresh.innerText.includes({expected_refresh!r})) throw new Error('Localized refresh action missing');
                refresh.focus();
                if (document.activeElement !== refresh) throw new Error('Report refresh action cannot receive keyboard focus');
                if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 2) throw new Error('Reporting dashboard has horizontal viewport overflow');
                {"if (getComputedStyle(form).direction !== 'rtl') throw new Error('Arabic reporting dashboard is not rendered RTL');" if arabic else ""}
                console.log('test successful');
            }})();
        """
        with capture_views("reporting_dashboard_ar" if arabic else "reporting_dashboard_en", rtl=arabic):
            self.browser_js(
                f"/odoo/action-{action.id}",
                code,
                ready="!!document.querySelector('.o_form_view')",
                login="admin",
                timeout=60,
            )

    def test_reporting_dashboard_english_visual_contract(self):
        self._show_dashboard(arabic=False)

    def test_reporting_dashboard_arabic_rtl_visual_contract(self):
        self._show_dashboard(arabic=True)
