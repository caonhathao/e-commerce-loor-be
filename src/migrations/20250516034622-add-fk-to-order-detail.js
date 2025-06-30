'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE store.order_detail
      ADD CONSTRAINT fk_order_detail_order_id
      FOREIGN KEY (order_id)
      REFERENCES store.orders(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Xóa khóa ngoại order_id
    await queryInterface.sequelize.query(`
      ALTER TABLE store.order_detail
      DROP CONSTRAINT IF EXISTS fk_order_detail_order_id;
    `);
  }
};
