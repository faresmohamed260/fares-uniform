import { PaymentScreen } from "@point_of_sale/app/screens/payment_screen/payment_screen";
import { ask } from "@point_of_sale/app/utils/make_awaitable_dialog";
import { _t } from "@web/core/l10n/translation";
import { patch } from "@web/core/utils/patch";

patch(PaymentScreen.prototype, {
    async addNewPaymentLine(paymentMethod) {
        const requiresNotification = paymentMethod.fu_confirmation_mode === "bank_notification";
        if (requiresNotification) {
            const confirmed = await ask(this.dialog, {
                title: _t("Confirm bank notification"),
                body: _t(
                    "Confirm that you observed the bank transaction notification before recording this payment."
                ),
                confirmLabel: _t("Notification observed"),
                cancelLabel: _t("Cancel"),
            });
            if (!confirmed) {
                return false;
            }
        }

        const added = await super.addNewPaymentLine(paymentMethod);
        if (added && requiresNotification) {
            const paymentLine = this.currentOrder.getSelectedPaymentline() || this.paymentLines.at(-1);
            if (paymentLine?.payment_method_id?.id === paymentMethod.id) {
                paymentLine.fu_manual_confirmed = true;
            }
        }
        return added;
    },
});
