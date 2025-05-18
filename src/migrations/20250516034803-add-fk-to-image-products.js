'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE store.image_products
      ADD CONSTRAINT fk_image_products_product_id
      FOREIGN KEY (product_id)
      REFERENCES store.products(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE store.image_products
      DROP CONSTRAINT IF EXISTS fk_image_products_product_id;
    `);
  }
};
