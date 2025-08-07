'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            ALTER TABLE store.order_log
                ADD CONSTRAINT fk_order_log_order_id
                    FOREIGN KEY (order_id)
                        REFERENCES store.orders (id)
                        ON DELETE CASCADE
                        ON UPDATE CASCADE;`)
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            ALTER TABLE store.order_log
                DROP CONSTRAINT IF EXISTS fk_order_log_order_id;`)
    }
};
