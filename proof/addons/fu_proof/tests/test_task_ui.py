from odoo import fields
from odoo.tests import HttpCase, tagged
from .visual_capture import capture_views, install_arabic


@tagged("post_install", "-at_install")
class TestTaskUI(HttpCase):
    def show_task(self, arabic=False):
        if arabic:
            install_arabic(self.env, self.env.ref("base.user_admin"))
        product = self.env["product.product"].create({
            "name": "قميص مدرسي — M" if arabic else "School polo — M",
        })
        order = self.env["fu.proof.order"].create({
            "name": "طلب تجريبي ٠٠١" if arabic else "Sample order 001", "amount_due": 100,
        })
        line = self.env["fu.proof.line"].create({
            "order_id": order.id, "product_id": product.id,
            "quantity": 12, "pickup_date": fields.Date.today(),
        })
        task = self.env["fu.proof.line"].make_tasks(10)
        self.assertEqual(line.task_id, task)
        action = self.env.ref("fu_proof.tasks")
        code = """
            (async () => {
                const button = document.querySelector('button[name="advance"]');
                if (!button) throw new Error("Advance control missing");
                button.focus();
                if (document.activeElement !== button) throw new Error("Advance cannot receive focus");
                button.click();
                const deadline = Date.now() + 10000;
                while (!document.querySelector('[data-value="production"].o_arrow_button_current')) {
                    if (Date.now() > deadline) throw new Error("Production status did not update");
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                console.log("test successful");
            })();
        """
        with capture_views("task_ar" if arabic else "task_en", rtl=arabic):
            self.browser_js(
                f"/odoo/action-{action.id}/{task.id}", code,
                ready="!!document.querySelector('.o_form_view button[name=advance]')",
                login="admin", timeout=60,
            )
        task.invalidate_recordset()
        self.assertEqual(task.state, "production")

    def test_task_english(self):
        self.show_task()

    def test_task_arabic(self):
        self.show_task(arabic=True)
