{
    "name": "Fares Uniform Preorders",
    "summary": "School-uniform preorder, payment balance and collection workflow for Fares Uniform",
    "version": "19.0.1.1.0",
    "category": "Sales/Sales",
    "author": "Fares Uniform",
    "license": "LGPL-3",
    "depends": ["fu_core", "fu_retail", "sale_stock", "account"],
    "data": [
        "security/fu_preorder_security.xml",
        "security/ir.model.access.csv",
        "views/fu_preorder_views.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "fu_preorder/static/src/online_guard.js",
        ],
    },
    "installable": True,
    "application": False,
}
