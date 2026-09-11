import * as Chrome from "@point_of_sale/../tests/pos/tours/utils/chrome_util";
import * as Dialog from "@point_of_sale/../tests/generic_helpers/dialog_util";
import * as Offline from "@point_of_sale/../tests/generic_helpers/offline_util";
import * as ProductScreen from "@point_of_sale/../tests/pos/tours/utils/product_screen_util";
import { registry } from "@web/core/registry";

registry.category("web_tour.tours").add("fu_retail_returns_entry_online", {
    steps: () => [
        Chrome.startPoS(),
        Dialog.confirm(),
        ...ProductScreen.clickControlButton("Returns / Exchanges"),
        {
            trigger: ".o_list_view",
            content: "Controlled Returns & Exchanges workspace opens instead of native POS refund flow",
            run() {
                const body = document.body.textContent || "";
                if (!body.includes("Returns & Exchanges")) {
                    throw new Error("Fares return workspace did not open from POS");
                }
                if (document.querySelector(".ticket-screen")) {
                    throw new Error("Native POS refund ticket screen remained reachable from the replaced entry");
                }
            },
        },
    ],
});

registry.category("web_tour.tours").add("fu_retail_returns_entry_offline", {
    steps: () => [
        Chrome.startPoS(),
        Dialog.confirm(),
        Offline.setOfflineMode(),
        ...ProductScreen.clickControlButton("Returns / Exchanges"),
        {
            trigger: ".product-screen",
            content: "Return entry fails closed while POS is offline",
            run() {
                if (document.querySelector(".o_list_view") || document.querySelector(".ticket-screen")) {
                    throw new Error("Offline POS return entry escaped into a server or native refund workflow");
                }
                const actions = document.querySelector(".control-buttons-modal");
                if (!actions) {
                    throw new Error("Offline return entry unexpectedly closed the POS action dialog");
                }
            },
        },
        Offline.setOnlineMode(),
    ],
});
