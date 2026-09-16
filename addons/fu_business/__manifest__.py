{
    "name": "Fares Uniform Business Clients",
    "summary": "Business-client enquiry, sample, payment and guarded shipment workflow",
    "version": "19.0.2.0.0",
    "category": "Sales/CRM",
    "author": "Fares Uniform",
    "license": "LGPL-3",
    "depends": ["fu_core", "fu_preorder", "sale_crm", "sale_stock"],
    "data": [
        "security/fu_business_security.xml",
        "security/ir.model.access.csv",
        "views/fu_business_views.xml",
    ],
    "installable": True,
    "application": False,
}
