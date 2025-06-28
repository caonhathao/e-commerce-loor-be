'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm FK cho user_id
    await queryInterface.sequelize.query(`
            ALTER TABLE store.notify_brand
                ADD CONSTRAINT fk_notify_brand_user_id
                    FOREIGN KEY (brand_id)
                        REFERENCES store.brands (id)
                        ON DELETE CASCADE
                        ON UPDATE CASCADE;
        `);
  },

  async down(queryInterface, Sequelize) {
    // Xóa FK user_id
    await queryInterface.sequelize.query(`
            ALTER TABLE store.notify_brand
            DROP
            CONSTRAINT IF EXISTS fk_notify_brand_user_id;
        `);
  }
};
