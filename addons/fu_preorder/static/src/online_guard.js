import { _t } from "@web/core/l10n/translation";

let preorderOnline = navigator.onLine !== false;
let scheduled = false;

function applyPreorderConnectivityState() {
    scheduled = false;
    const title = _t("Online connection required.");
    const message = preorderOnline
        ? _t("Online — preorder actions use live server checks.")
        : _t("Offline — preorder actions are disabled until connection returns.");

    for (const banner of document.querySelectorAll(".fu-online-required-banner")) {
        banner.dataset.fuOnlineState = preorderOnline ? "online" : "offline";
        banner.classList.toggle("alert-info", preorderOnline);
        banner.classList.toggle("alert-danger", !preorderOnline);
        const heading = banner.querySelector("strong");
        if (heading && heading.textContent !== title) {
            heading.textContent = title;
        }
        const state = banner.querySelector(".fu-online-state");
        if (state && state.textContent !== message) {
            state.textContent = message;
        }
    }

    for (const button of document.querySelectorAll("button.fu-online-required-action")) {
        if (button.disabled === preorderOnline) {
            button.disabled = !preorderOnline;
        }
        button.setAttribute("aria-disabled", preorderOnline ? "false" : "true");
    }
}

function scheduleApply() {
    if (scheduled) {
        return;
    }
    scheduled = true;
    queueMicrotask(applyPreorderConnectivityState);
}

window.addEventListener("online", () => {
    preorderOnline = true;
    scheduleApply();
});
window.addEventListener("offline", () => {
    preorderOnline = false;
    scheduleApply();
});

function startObserver() {
    const observer = new MutationObserver(scheduleApply);
    observer.observe(document.body, { childList: true, subtree: true });
    scheduleApply();
}

if (document.body) {
    startObserver();
} else {
    window.addEventListener("DOMContentLoaded", startObserver, { once: true });
}
