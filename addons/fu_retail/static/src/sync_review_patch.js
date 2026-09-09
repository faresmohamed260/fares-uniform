import { PosOrder } from "@point_of_sale/app/models/pos_order";
import { PosData } from "@point_of_sale/app/services/data_service";
import { ConnectionLostError } from "@web/core/network/rpc";
import { patch } from "@web/core/utils/patch";

const REVIEW_STORAGE_PREFIX = "fu_retail.sync_review.";
const RETRYABLE_STORAGE_PREFIX = "fu_retail.sync_retryable.";

function reviewStorageKey(uuid) {
    return `${REVIEW_STORAGE_PREFIX}${uuid}`;
}

function retryableStorageKey(uuid) {
    return `${RETRYABLE_STORAGE_PREFIX}${uuid}`;
}

function readReviewMarker(uuid) {
    if (!uuid) {
        return false;
    }
    try {
        return localStorage.getItem(reviewStorageKey(uuid)) === "1";
    } catch {
        return false;
    }
}

function readRetryableMarker(uuid) {
    if (!uuid) {
        return false;
    }
    try {
        return localStorage.getItem(retryableStorageKey(uuid)) === "1";
    } catch {
        return false;
    }
}

function writeReviewMarker(order, required) {
    if (!order?.uuid) {
        return;
    }

    order.uiState.fuSyncReviewRequired = Boolean(required);
    try {
        if (required) {
            localStorage.setItem(reviewStorageKey(order.uuid), "1");
        } else {
            localStorage.removeItem(reviewStorageKey(order.uuid));
        }
    } catch {
        // The native POS order remains authoritative even if browser storage is unavailable.
    }
}

function writeRetryableMarker(order, required) {
    if (!order?.uuid) {
        return;
    }

    order.uiState.fuSyncRetryableFailure = Boolean(required);
    try {
        if (required) {
            localStorage.setItem(retryableStorageKey(order.uuid), "1");
        } else {
            localStorage.removeItem(retryableStorageKey(order.uuid));
        }
    } catch {
        // The native POS order remains authoritative even if browser storage is unavailable.
    }
}

function ordersFromSyncPayload(data, args) {
    const payloads = Array.isArray(args?.[0]) ? args[0] : [];
    return payloads
        .map((payload) => data.models?.["pos.order"]?.getBy("uuid", payload?.uuid))
        .filter(Boolean);
}

patch(PosOrder.prototype, {
    initState() {
        super.initState(...arguments);
        this.uiState.fuSyncReviewRequired = readReviewMarker(this.uuid);
        this.uiState.fuSyncRetryableFailure = readRetryableMarker(this.uuid);
    },

    get fuSyncReviewRequired() {
        return Boolean(this.uiState?.fuSyncReviewRequired || readReviewMarker(this.uuid));
    },

    get fuSyncRetryableFailure() {
        return Boolean(this.uiState?.fuSyncRetryableFailure || readRetryableMarker(this.uuid));
    },
});

patch(PosData.prototype, {
    async call(model, method, args = [], kwargs = {}, queue = false) {
        const isOrderSync = model === "pos.order" && method === "sync_from_ui";
        const localOrders = isOrderSync ? ordersFromSyncPayload(this, args) : [];
        const syncStartedWhileOffline = isOrderSync && this.network.offline;

        try {
            const result = await super.call(model, method, args, kwargs, queue);
            if (isOrderSync) {
                for (const order of localOrders) {
                    writeReviewMarker(order, false);
                    writeRetryableMarker(order, false);
                }
            }
            return result;
        } catch (error) {
            if (isOrderSync) {
                for (const order of localOrders) {
                    if (error instanceof ConnectionLostError) {
                        if (!syncStartedWhileOffline) {
                            writeRetryableMarker(order, true);
                        }
                    } else {
                        writeRetryableMarker(order, false);
                        writeReviewMarker(order, true);
                    }
                }
            }
            throw error;
        }
    },
});
