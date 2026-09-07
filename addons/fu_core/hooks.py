def post_init_hook(env):
    """Bring existing inventory-tracked variants under the permanent Fares ID contract."""
    env["product.product"].search([("is_storable", "=", True)])._fu_ensure_identifiers()
