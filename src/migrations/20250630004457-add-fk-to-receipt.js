'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm FK cho user_id
    await queryInterface.sequelize.query(`
            ALTER TABLE store.receipt
                ADD CONSTRAINT fk_receipt_user_id
                    FOREIGN KEY (user_id)
                        REFERENCES store.users (id)
                        ON DELETE CASCADE
                        ON UPDATE CASCADE;
        `);
  },

  async down(queryInterface, Sequelize) {
    // Xóa FK user_id
    await queryInterface.sequelize.query(`
            ALTER TABLE store.receipt
            DROP
            CONSTRAINT IF EXISTS fk_receipt_user_id;
        `);
  }
};
