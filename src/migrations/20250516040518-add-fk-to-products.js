'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
      ALTER TABLE store.products
      ADD CONSTRAINT fk_products_category_id
      FOREIGN KEY (category_id)
      REFERENCES store.category(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `);

        await queryInterface.sequelize.query(`
      ALTER TABLE store.products
      ADD CONSTRAINT fk_products_subcategory_id
      FOREIGN KEY (subcategory_id)
      REFERENCES store.sub_category(id);
    `);

        await queryInterface.sequelize.query(`
      ALTER TABLE store.products
      ADD CONSTRAINT fk_products_brand_id
      FOREIGN KEY (brand_id)
      REFERENCES store.brands(id);
    `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
      ALTER TABLE store.products
      DROP CONSTRAINT IF EXISTS fk_products_category_id;
    `);
        await queryInterface.sequelize.query(`
      ALTER TABLE store.products
      DROP CONSTRAINT IF EXISTS fk_products_subcategory_id;
    `);
        await queryInterface.sequelize.query(`
      ALTER TABLE store.products
      DROP CONSTRAINT IF EXISTS fk_products_brand_id;
    `);
    }
};
