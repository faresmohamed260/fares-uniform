from odoo import Command
from odoo.tests import HttpCase, tagged

from odoo.addons.fu_core.tests.visual_capture import capture_views, install_arabic


@tagged("post_install", "-at_install")
class TestFaresPhase5AArabicLaunchPolish(HttpCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.admin = cls.env.ref("base.user_admin")
        cls.admin.write(
            {"group_ids": [Command.link(cls.env.ref("fu_core.group_fu_owner_admin").id)]}
        )

    def test_preorder_connectivity_and_cancel_are_fully_arabic(self):
        install_arabic(self.env, self.admin)
        action = self.env.ref("fu_preorder.action_fu_preorder_create_wizard")
        code = """
            (async () => {
                const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
                const waitFor = async (selector) => {
                    for (let i = 0; i < 120; i++) {
                        const node = document.querySelector(selector);
                        if (node) return node;
                        await sleep(50);
                    }
                    throw new Error('Timed out waiting for ' + selector);
                };
                const dialog = await waitFor('.o_dialog');
                const banner = await waitFor('.fu-online-required-banner');
                const create = await waitFor('button[name="action_create"]');
                window.dispatchEvent(new Event('online'));
                await sleep(100);
                const requiredOnline = [
                    'طلب مسبق جديد',
                    'يلزم اتصال بالإنترنت.',
                    'متصل — إجراءات الطلب المسبق تستخدم تحققًا مباشرًا من الخادم.',
                    'إنشاء الطلب المسبق',
                    'إلغاء',
                ];
                for (const text of requiredOnline) {
                    if (!dialog.innerText.includes(text)) throw new Error('Missing Arabic preorder text: ' + text);
                }
                const forbiddenEnglish = [
                    'Online connection required.',
                    'Online — preorder actions use live server checks.',
                    'Cancel',
                ];
                for (const text of forbiddenEnglish) {
                    if (dialog.innerText.includes(text)) throw new Error('English preorder fragment leaked into Arabic UI: ' + text);
                }
                if (banner.dataset.fuOnlineState !== 'online') throw new Error('Preorder banner did not enter online state');
                window.dispatchEvent(new Event('offline'));
                await sleep(100);
                if (!create.disabled || banner.dataset.fuOnlineState !== 'offline') throw new Error('Preorder workflow did not fail closed offline');
                if (!banner.innerText.includes('غير متصل — إجراءات الطلب المسبق معطلة حتى عودة الاتصال.')) throw new Error('Arabic preorder offline message missing');
                create.focus();
                if (document.activeElement !== create) throw new Error('Preorder create action cannot receive keyboard focus');
                const form = dialog.querySelector('.o_form_view');
                if (!form || getComputedStyle(form).direction !== 'rtl') throw new Error('Arabic preorder dialog is not rendered RTL');
                console.log('test successful');
            })();
        """
        with capture_views("phase5a_preorder_ar", rtl=True):
            self.browser_js(
                f"/odoo/action-{action.id}",
                code,
                ready="!!document.querySelector('.o_dialog')",
                login="admin",
                timeout=60,
            )
