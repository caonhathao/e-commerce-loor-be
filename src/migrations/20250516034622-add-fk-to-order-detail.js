'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm khóa ngoại cho order_id
    await queryInterface.sequelize.query(`
      ALTER TABLE store.order_detail
      ADD CONSTRAINT fk_order_detail_order_id
      FOREIGN KEY (order_id)
      REFERENCES store.orders(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `);

    // Thêm khóa ngoại cho variant_id
    await queryInterface.sequelize.query(`
      ALTER TABLE store.order_detail
      ADD CONSTRAINT fk_order_detail_variant_id
      FOREIGN KEY (variant_id)
      REFERENCES store.product_variants(sku);
    `);
  },

  async down(queryInterface, Sequelize) {
    // Xóa khóa ngoại order_id
    await queryInterface.sequelize.query(`
      ALTER TABLE store.order_detail
      DROP CONSTRAINT IF EXISTS fk_order_detail_order_id;
    `);

    // Xóa khóa ngoại variant_id
    await queryInterface.sequelize.query(`
      ALTER TABLE store.order_detail
      DROP CONSTRAINT IF EXISTS fk_order_detail_variant_id;
    `);
  }
};
