import re

from psycopg2 import IntegrityError

from odoo import Command
from odoo.exceptions import ValidationError
from odoo.tests.common import TransactionCase
from odoo.tools import mute_logger


class TestFaresProductIdentity(TransactionCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.size_letter = cls.env["product.attribute"].create({
            "name": "Synthetic Letter Size",
            "create_variant": "always",
        })
        cls.size_letter_values = cls.env["product.attribute.value"].create([
            {"name": "M", "attribute_id": cls.size_letter.id},
            {"name": "L", "attribute_id": cls.size_letter.id},
        ])
        cls.size_age = cls.env["product.attribute"].create({
            "name": "Synthetic Age Size",
            "create_variant": "always",
        })
        cls.size_age_values = cls.env["product.attribute.value"].create([
            {"name": "10Y", "attribute_id": cls.size_age.id},
            {"name": "12Y", "attribute_id": cls.size_age.id},
        ])

    def _make_template(self, name, attribute, values):
        return self.env["product.template"].create({
            "name": name,
            "is_storable": True,
            "attribute_line_ids": [Command.create({
                "attribute_id": attribute.id,
                "value_ids": [Command.set(values.ids)],
            })],
        })

    def test_separate_designs_and_configurable_size_systems(self):
        school_a = self._make_template(
            "Synthetic School A Navy Polo", self.size_letter, self.size_letter_values
        )
        school_b = self._make_template(
            "Synthetic School B Navy Polo", self.size_age, self.size_age_values
        )

        self.assertNotEqual(school_a.id, school_b.id)
        self.assertEqual(len(school_a.product_variant_ids), 2)
        self.assertEqual(len(school_b.product_variant_ids), 2)
        self.assertEqual(
            set(school_a.product_variant_ids.product_template_attribute_value_ids.mapped("name")),
            {"M", "L"},
        )
        self.assertEqual(
            set(school_b.product_variant_ids.product_template_attribute_value_ids.mapped("name")),
            {"10Y", "12Y"},
        )

    def test_storable_variants_receive_unique_permanent_codes_and_barcodes(self):
        template = self._make_template(
            "Synthetic Identifier Polo", self.size_letter, self.size_letter_values
        )
        variants = template.product_variant_ids.sorted("id")
        self.assertEqual(len(variants), 2)

        codes = variants.mapped("default_code")
        self.assertEqual(len(codes), len(set(codes)))
        for variant in variants:
            self.assertRegex(variant.default_code, r"^FU-\d{6}$")
            self.assertEqual(variant.barcode, variant.default_code)
            self.assertEqual(
                self.env["product.product"].search([("default_code", "=", variant.default_code)]),
                variant,
            )
            self.assertEqual(
                self.env["product.product"].search([("barcode", "=", variant.barcode)]),
                variant,
            )

        original = variants[0].default_code
        template.name = "Synthetic Identifier Polo Renamed"
        self.assertEqual(variants[0].default_code, original)

        with self.assertRaises(ValidationError):
            variants[0].default_code = "FU-999999"
        self.assertEqual(variants[0].default_code, original)

    def test_database_index_rejects_duplicate_fu_code(self):
        template = self._make_template(
            "Synthetic DB Uniqueness Polo", self.size_letter, self.size_letter_values
        )
        first, second = template.product_variant_ids.sorted("id")
        self.assertNotEqual(first.default_code, second.default_code)

        with mute_logger("odoo.sql_db"), self.assertRaises(IntegrityError), self.cr.savepoint():
            self.cr.execute(
                "UPDATE product_product SET default_code = %s WHERE id = %s",
                (first.default_code, second.id),
            )

    def test_new_storable_product_ignores_manual_identifier_seed(self):
        template = self.env["product.template"].create({
            "name": "Synthetic System-Owned Code",
            "is_storable": True,
        })
        product = template.product_variant_id
        self.assertTrue(re.fullmatch(r"FU-\d{6}", product.default_code))
        self.assertEqual(product.barcode, product.default_code)

    def test_non_storable_product_is_not_forced_into_fu_sequence(self):
        template = self.env["product.template"].create({
            "name": "Synthetic Service",
            "is_storable": False,
        })
        self.assertFalse(template.product_variant_id.default_code)
        self.assertFalse(template.product_variant_id.barcode)

    def test_turning_inventory_tracking_on_assigns_identifiers(self):
        template = self.env["product.template"].create({
            "name": "Synthetic Later-Tracked Garment",
            "is_storable": False,
        })
        product = template.product_variant_id
        self.assertFalse(product.default_code)

        template.is_storable = True
        self.assertRegex(product.default_code, r"^FU-\d{6}$")
        self.assertEqual(product.barcode, product.default_code)
