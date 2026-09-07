{
    "name": "Fares Uniform — disposable proof",
    "author": "Fares Uniform",
    "version": "19.0.0.1.1",
    "license": "LGPL-3",
    "depends": ["sale_management", "point_of_sale"],
    "data": ["security/ir.model.access.csv", "views/proof.xml"],
    "assets": {
        "point_of_sale._assets_pos": [
            "fu_proof/static/src/offline_restore_patch.js",
            "fu_proof/static/src/proof.css",
        ],
        "web.assets_tests": ["fu_proof/static/tests/offline_tour.js"],
    },
    "installable": True,
    "application": False,
}
