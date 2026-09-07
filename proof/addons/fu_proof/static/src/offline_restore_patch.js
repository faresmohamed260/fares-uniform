import { PosData } from "@point_of_sale/app/services/data_service";
import { patch } from "@web/core/utils/patch";

// Odoo 19.0's missingRecursive() returns an empty accumulator immediately
// when the POS starts offline. The records have already been read safely from
// IndexedDB at this point, so dropping recordMap prevents paid unsynced orders
// from being hydrated into the POS model after an offline reload.
//
// Keep this as an addon-level compatibility patch: online behavior remains
// entirely upstream and Odoo core is not forked or modified.
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
