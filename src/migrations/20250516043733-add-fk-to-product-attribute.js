'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE store.product_attribute
      ADD CONSTRAINT fk_product_attribute_product_id
      FOREIGN KEY (variant_id)
      REFERENCES store.product_variants(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE store.product_attribute
      DROP CONSTRAINT IF EXISTS fk_product_attribute_product_id;
    `);
  }
};
