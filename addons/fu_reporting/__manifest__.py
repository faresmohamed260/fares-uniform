{
    "name": "Fares Uniform Operational Reporting",
    "summary": "Role-scoped live operational reports over native Odoo/Fares truth",
    "version": "19.0.1.0.0",
    "category": "Operations/Reporting",
    "author": "Fares Uniform",
    "license": "LGPL-3",
    "depends": ["fu_core", "fu_retail", "fu_preorder", "fu_production", "fu_business"],
    "data": [
        "security/fu_reporting_security.xml",
        "security/ir.model.access.csv",
        "views/fu_reporting_views.xml",
    ],
    "installable": True,
    "application": False,
}
