'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
        ALTER TABLE store.districts
            ADD CONSTRAINT fk_districts_province_id
                FOREIGN KEY (province_id)
                    REFERENCES store.provinces (id)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE;

    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
            ALTER TABLE store.districts
            DROP
            CONSTRAINT IF EXISTS  fk_districts_province_id
        `);
  }
};
