'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE store.featured_product
        ADD CONSTRAINT fk_featured_product_product_id
          FOREIGN KEY (product_id)
            REFERENCES store.products (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
            ALTER TABLE store.receipt
            DROP
            CONSTRAINT IF EXISTS fk_featured_product_product_id
        `);
  }
};
