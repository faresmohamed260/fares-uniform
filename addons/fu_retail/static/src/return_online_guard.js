import { _t } from "@web/core/l10n/translation";

let returnsOnline = navigator.onLine !== false;
let scheduled = false;

function applyReturnConnectivityState() {
    scheduled = false;
    const title = _t("Online connection required.");
    const message = returnsOnline
        ? _t("Online — returns and exchanges use live server authorization.")
        : _t("Offline — returns and exchanges are disabled until connection returns.");

    for (const banner of document.querySelectorAll(".fu-return-online-required-banner")) {
        banner.dataset.fuOnlineState = returnsOnline ? "online" : "offline";
        banner.classList.toggle("alert-info", returnsOnline);
        banner.classList.toggle("alert-danger", !returnsOnline);
        const heading = banner.querySelector("strong");
        if (heading && heading.textContent !== title) {
            heading.textContent = title;
        }
        const state = banner.querySelector(".fu-return-online-state");
        if (state && state.textContent !== message) {
            state.textContent = message;
        }
    }

    for (const button of document.querySelectorAll("button.fu-return-online-required-action")) {
        button.disabled = !returnsOnline;
        button.setAttribute("aria-disabled", returnsOnline ? "false" : "true");
    }
}

function scheduleApply() {
    if (scheduled) {
        return;
    }
    scheduled = true;
    queueMicrotask(applyReturnConnectivityState);
}

window.addEventListener("online", () => {
    returnsOnline = true;
    scheduleApply();
});
window.addEventListener("offline", () => {
    returnsOnline = false;
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
