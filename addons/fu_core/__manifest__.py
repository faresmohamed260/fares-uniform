{
    "name": "Fares Uniform Core",
    "summary": "Core product, finished-stock identity and access rules for Fares Uniform",
    "version": "19.0.1.3.0",
    "category": "Inventory/Inventory",
    "author": "Fares Uniform",
    "license": "LGPL-3",
    "depends": ["stock"],
    "data": [
        "security/fu_security.xml",
        "security/ir.model.access.csv",
        "data/ir_sequence_data.xml",
        "views/fu_inventory_views.xml",
        "views/res_users_views.xml",
    ],
    "post_init_hook": "post_init_hook",
    "installable": True,
    "application": False,
}
