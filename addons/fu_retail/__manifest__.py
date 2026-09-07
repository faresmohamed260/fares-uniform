{
    "name": "Fares Uniform Retail",
    "summary": "Retail checkout, payment confirmation and offline compatibility for Fares Uniform",
    "version": "19.0.1.0.0",
    "category": "Sales/Point of Sale",
    "author": "Fares Uniform",
    "license": "LGPL-3",
    "depends": ["fu_core", "point_of_sale"],
    "data": [
        "views/pos_payment_method_views.xml",
    ],
    "assets": {
        "point_of_sale._assets_pos": [
            "fu_retail/static/src/offline_restore_patch.js",
            "fu_retail/static/src/payment_confirmation_patch.js",
            "fu_retail/static/src/receipt_sync_status.xml",
        ],
        "web.assets_tests": [
            "fu_retail/static/tests/retail_tour.js",
        ],
    },
    "installable": True,
    "application": False,
}
