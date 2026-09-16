{
    "name": "Fares Uniform Production",
    "summary": "Preorder demand aggregation and bounded factory production workflow for Fares Uniform",
    "version": "19.0.1.0.0",
    "category": "Manufacturing/Manufacturing",
    "author": "Fares Uniform",
    "license": "LGPL-3",
    "depends": ["fu_core", "fu_preorder"],
    "data": [
        "security/fu_production_security.xml",
        "security/ir.model.access.csv",
        "data/production_data.xml",
        "views/production_views.xml",
    ],
    "installable": True,
    "application": False,
}
