{
    "name": "Fares Uniform Retail",
    "summary": "Retail checkout, returns, payment confirmation and offline compatibility for Fares Uniform",
    "version": "19.0.1.2.0",
    "category": "Sales/Point of Sale",
    "author": "Fares Uniform",
    "license": "LGPL-3",
    "depends": ["fu_core", "point_of_sale"],
    "data": [
        "security/fu_retail_security.xml",
        "security/ir.model.access.csv",
        "views/pos_payment_method_views.xml",
        "views/return_request_views.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "fu_retail/static/src/return_online_guard.js",
        ],
        "point_of_sale._assets_pos": [
            "fu_retail/static/src/offline_restore_patch.js",
            "fu_retail/static/src/payment_confirmation_patch.js",
            "fu_retail/static/src/sync_review_patch.js",
            "fu_retail/static/src/return_entry_patch.js",
            "fu_retail/static/src/return_entry_patch.xml",
            "fu_retail/static/src/receipt_sync_status.xml",
        ],
        "web.assets_tests": [
            "fu_retail/static/tests/retail_tour.js",
            "fu_retail/static/tests/return_tour.js",
        ],
    },
    "installable": True,
    "application": False,
}
