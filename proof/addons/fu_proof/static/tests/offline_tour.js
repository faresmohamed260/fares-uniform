/* global posmodel */
import * as Chrome from "@point_of_sale/../tests/pos/tours/utils/chrome_util";
import * as Dialog from "@point_of_sale/../tests/generic_helpers/dialog_util";
import * as ProductScreen from "@point_of_sale/../tests/pos/tours/utils/product_screen_util";
import * as PaymentScreen from "@point_of_sale/../tests/pos/tours/utils/payment_screen_util";
import * as ReceiptScreen from "@point_of_sale/../tests/pos/tours/utils/receipt_screen_util";
import * as Offline from "@point_of_sale/../tests/generic_helpers/offline_util";
import { refresh } from "@point_of_sale/../tests/generic_helpers/utils";
import { registry } from "@web/core/registry";

for (const method of ["Bank", "Cash"]) {
registry.category("web_tour.tours").add("fu_offline_checkout_" + method, {
    steps: () => [
        Chrome.startPoS(),
        Dialog.confirm(),
        Offline.setOfflineMode(),
        ProductScreen.clickDisplayedProduct("Desk Pad"),
        {
            trigger: "body",
            run() {
                sessionStorage.setItem("fu.proof.order_uuid", posmodel.getOrder().uuid);
            },
        },
        ProductScreen.clickPayButton(),
        PaymentScreen.clickPaymentMethod(method),
        PaymentScreen.clickValidate(),
        ReceiptScreen.isShown(),
        refresh(),
        Dialog.confirm("Continue with limited functionality"),
        {
            trigger: "body",
            content: "Paid order survives reload without API connectivity",
            run() {
                const uuid = sessionStorage.getItem("fu.proof.order_uuid");
                const order = posmodel.models["pos.order"].find(o => o.uuid === uuid);
                if (!order || order.state !== "paid") {
                    throw new Error("Offline paid order missing after reload");
                }
            },
        },
        Offline.setOnlineMode(),
        {
            trigger: "body",
            content: "Reconnect and repeat synchronization",
            async run() {
                await posmodel.syncAllOrders();
                await posmodel.syncAllOrders();
            },
        },
    ].flat(),
});

}

registry.category("web_tour.tours").add("fu_pos_visual", {
    steps: () => [
        Chrome.startPoS(),
        Dialog.confirm(),
        ProductScreen.clickDisplayedProduct("Desk Pad"),
        {
            trigger: ".product-screen",
            content: "Native POS remains usable with proof styling",
            run() {
                if (!document.querySelector(".product-list")) throw new Error("Product list missing");
                const button = document.querySelector("button:not([disabled])");
                button.focus();
                if (document.activeElement !== button) throw new Error("Button cannot receive keyboard focus");
            },
        },
    ].flat(),
});
