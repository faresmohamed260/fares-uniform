def post_init_hook(env):
    """Bring a fresh Odoo database under the first Fares operational contracts."""
    env["stock.location"]._fu_configure_initial_locations()
    env["product.product"].search([("is_storable", "=", True)])._fu_ensure_identifiers()
