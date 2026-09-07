/* global posmodel */
import * as Chrome from "@point_of_sale/../tests/pos/tours/utils/chrome_util";
import * as Dialog from "@point_of_sale/../tests/generic_helpers/dialog_util";
import * as ProductScreen from "@point_of_sale/../tests/pos/tours/utils/product_screen_util";
import * as PaymentScreen from "@point_of_sale/../tests/pos/tours/utils/payment_screen_util";
import * as ReceiptScreen from "@point_of_sale/../tests/pos/tours/utils/receipt_screen_util";
import * as Offline from "@point_of_sale/../tests/generic_helpers/offline_util";
import { refresh } from "@point_of_sale/../tests/generic_helpers/utils";
import { registry } from "@web/core/registry";

const EN_PENDING_SYNC = {
    heading: "Saved on this device",
    detail: "Pending server sync — this sale is not yet server-confirmed.",
};

const AR_PENDING_SYNC = {
    heading: "تم الحفظ على هذا الجهاز",
    detail: "بانتظار المزامنة مع الخادم — لم يتم تأكيد هذه العملية على الخادم بعد.",
    direction: "rtl",
};

function pendingSyncReceiptIsTruthful(expected) {
    return {
        trigger: ".receipt-screen .fu-sync-pending",
        content: "Offline receipt clearly identifies local-only pending sync state",
        run() {
            const order = posmodel.getOrder();
            const pending = document.querySelector(".receipt-screen .fu-sync-pending");
            const text = pending?.textContent?.replace(/\s+/g, " ").trim() || "";
            if (order?.isSynced) {
                throw new Error("Pending-sync receipt rendered for an order already marked synced");
            }
            if (!text.includes(expected.heading) || !text.includes(expected.detail)) {
                throw new Error(`Pending-sync receipt copy mismatch: ${text}`);
            }
            if (text.includes("Payment Successful") || pending?.classList.contains("border-success")) {
                throw new Error("Offline local-only receipt is still presented as server-confirmed success");
            }
            if (expected.direction) {
                const renderedDirection = pending ? getComputedStyle(pending).direction : "missing";
                if (renderedDirection !== expected.direction) {
                    throw new Error(
                        `Expected rendered receipt direction ${expected.direction}, got ${renderedDirection}`
                    );
                }
            }
        },
    };
}

function offlineCheckoutSteps(method, requiresConfirmation = false, expected = EN_PENDING_SYNC) {
    const paymentSteps = [];
    paymentSteps.push(...PaymentScreen.clickPaymentMethod(method));
    if (requiresConfirmation) {
        paymentSteps.push(Dialog.is({ title: "Confirm bank notification" }));
        paymentSteps.push(Dialog.confirm("Notification observed"));
        paymentSteps.push({
            trigger: "body",
            content: "Manual confirmation is persisted on the local payment",
            run() {
                const payment = posmodel.getOrder().getSelectedPaymentline();
                if (!payment?.fu_manual_confirmed) {
                    throw new Error("Confirmed payment line is missing fu_manual_confirmed");
                }
            },
        });
    }

    return [
        Chrome.startPoS(),
        Dialog.confirm(),
        Offline.setOfflineMode(),
        ProductScreen.clickDisplayedProduct("Desk Pad"),
        {
            trigger: "body",
            run() {
                sessionStorage.setItem("fu.retail.order_uuid", posmodel.getOrder().uuid);
            },
        },
        ProductScreen.clickPayButton(),
        ...paymentSteps.flat(),
        PaymentScreen.clickValidate(),
        ReceiptScreen.isShown(),
        Dialog.confirm(),
        pendingSyncReceiptIsTruthful(expected),
        refresh(),
        Dialog.confirm(),
        {
            trigger: "body",
            content: "Paid order survives offline reload in the POS model",
            async run() {
                const uuid = sessionStorage.getItem("fu.retail.order_uuid");
                const deadline = Date.now() + 5000;
                let order;
                while (Date.now() < deadline) {
                    order = posmodel.models["pos.order"].find((candidate) => candidate.uuid === uuid);
                    if (order?.state === "paid") {
                        if (requiresConfirmation) {
                            const payment = order.payment_ids.find(
                                (line) => line.payment_method_id?.name === method
                            );
                            if (!payment?.fu_manual_confirmed) {
                                throw new Error("Manual confirmation did not survive offline reload");
                            }
                        }
                        return;
                    }
                    await new Promise((resolve) => setTimeout(resolve, 100));
                }
                const local = await posmodel.data.indexedDB.readAll(["pos.order"]);
                const records = local?.["pos.order"] || [];
                const persisted = records.find((candidate) => candidate.uuid === uuid);
                throw new Error(
                    `Offline paid order did not hydrate after reload: uuid=${uuid}, ` +
                    `model=${order?.state || "missing"}, ` +
                    `indexedDB=${persisted?.state || "missing"}, indexedCount=${records.length}`
                );
            },
        },
        Offline.setOnlineMode(),
        {
            trigger: "body",
            content: "Reconnect and replay synchronization safely",
            async run() {
                await posmodel.syncAllOrders();
                await posmodel.syncAllOrders();
            },
        },
    ].flat();
}

registry.category("web_tour.tours").add("fu_retail_offline_cash", {
    steps: () => offlineCheckoutSteps("Cash"),
});

registry.category("web_tour.tours").add("fu_retail_offline_instapay", {
    steps: () => offlineCheckoutSteps("InstaPay", true),
});

registry.category("web_tour.tours").add("fu_retail_offline_cash_ar", {
    steps: () => offlineCheckoutSteps("Cash", false, AR_PENDING_SYNC),
});

registry.category("web_tour.tours").add("fu_retail_instapay_cancel_then_confirm", {
    steps: () => [
        Chrome.startPoS(),
        Dialog.confirm(),
        ProductScreen.clickDisplayedProduct("Desk Pad"),
        ProductScreen.clickPayButton(),
        PaymentScreen.clickPaymentMethod("InstaPay"),
        Dialog.is({ title: "Confirm bank notification" }),
        Dialog.cancel({ title: "Confirm bank notification" }),
        PaymentScreen.emptyPaymentlines("1.98"),
        PaymentScreen.clickPaymentMethod("InstaPay"),
        Dialog.confirm("Notification observed"),
        {
            trigger: "body",
            content: "Only the confirmed attempt creates a payment line",
            run() {
                const order = posmodel.getOrder();
                if (order.payment_ids.length !== 1 || !order.payment_ids[0].fu_manual_confirmed) {
                    throw new Error("InstaPay confirmation gate did not preserve the expected payment line");
                }
            },
        },
    ].flat(),
});
