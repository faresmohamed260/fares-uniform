import { PosData } from "@point_of_sale/app/services/data_service";
import { patch } from "@web/core/utils/patch";

// Compatibility boundary for pinned Odoo Community 19 at
// 1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf.
//
// At offline startup Odoo has already read durable records from IndexedDB, but
// the pinned PosData.missingRecursive() returns before copying recordMap into
// the accumulator. Paid unsynced orders therefore remain in IndexedDB yet are
// absent from the in-memory POS model after reload.
//
// Preserve only those already-read records while offline. Online execution
// delegates unchanged to upstream Odoo. Remove this patch only after an adopted
// upstream revision no longer drops the local record map and the hosted offline
// reload regression passes with this file removed.
patch(PosData.prototype, {
    async missingRecursive(recordMap, idsMap = {}, acc = {}) {
        if (!this.network.offline) {
            return await super.missingRecursive(recordMap, idsMap, acc);
        }

        for (const [model, records] of Object.entries(recordMap)) {
            acc[model] = acc[model] ? acc[model].concat(records) : records;
        }
        return acc;
    },
});
