{
    "name": "Fares Uniform — disposable proof",
    "version": "19.0.0.1.0",
    "license": "LGPL-3",
    "depends": ["sale_management", "point_of_sale"],
    "data": ["security/ir.model.access.csv", "views/proof.xml"],
    "assets": {
        "point_of_sale._assets_pos": ["fu_proof/static/src/proof.css"],
        "point_of_sale.assets_debug": ["fu_proof/static/tests/offline_tour.js"],
    },
    "installable": True,
    "application": False,
}
