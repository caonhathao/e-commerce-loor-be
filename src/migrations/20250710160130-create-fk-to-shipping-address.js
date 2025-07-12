'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE store.shipping_address
        ADD CONSTRAINT fk_shipping_address_user_id
          FOREIGN KEY (user_id)
            REFERENCES store.users (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
            ALTER TABLE store.shipping_address
            DROP
            CONSTRAINT IF EXISTS  fk_shipping_address_user_id
        `);
  }
};
