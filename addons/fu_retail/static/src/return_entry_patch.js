import { ControlButtons } from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";
import { _t } from "@web/core/l10n/translation";
import { patch } from "@web/core/utils/patch";

const RETURNS_WORKSPACE_URL = "/odoo/action-fu_retail.action_fu_retail_return_requests";

patch(ControlButtons.prototype, {
    async clickRefund() {
        if (navigator.onLine === false || this.pos.data?.network?.offline) {
            this.notification.add(_t("Returns and exchanges require an online connection."), {
                type: "warning",
            });
            return;
        }

        this.props.close?.();
        const syncSuccess = await this.pos.pushOrdersWithClosingPopup();
        if (!syncSuccess) {
            return;
        }
        window.location = RETURNS_WORKSPACE_URL;
    },
});
