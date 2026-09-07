{
    "name": "Fares Uniform Core",
    "summary": "Core product and finished-stock identity rules for Fares Uniform",
    "version": "19.0.1.1.1",
    "category": "Inventory/Inventory",
    "author": "Fares Uniform",
    "license": "LGPL-3",
    "depends": ["stock"],
    "data": [
        "security/ir.model.access.csv",
        "data/ir_sequence_data.xml",
    ],
    "post_init_hook": "post_init_hook",
    "installable": True,
    "application": False,
}
