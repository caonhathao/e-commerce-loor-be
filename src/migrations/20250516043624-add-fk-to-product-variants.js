'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE store.product_variants
      ADD CONSTRAINT fk_product_variants_product_id
      FOREIGN KEY (product_id)
      REFERENCES store.products(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE store.product_variants
      DROP CONSTRAINT IF EXISTS fk_product_variants_product_id;
    `);
  }
};
