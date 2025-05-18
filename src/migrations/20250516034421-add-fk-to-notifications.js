'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Thêm FK cho user_id
        await queryInterface.sequelize.query(`
            ALTER TABLE store.notifications
                ADD CONSTRAINT fk_notifications_user_id
                    FOREIGN KEY (user_id)
                        REFERENCES store.users (id)
                        ON DELETE CASCADE
                        ON UPDATE CASCADE;
        `);

        // Thêm FK cho brand_id
        await queryInterface.sequelize.query(`
            ALTER TABLE store.notifications
                ADD CONSTRAINT fk_notifications_brand_id
                    FOREIGN KEY (brand_id)
                        REFERENCES store.brands (id);
        `);
    },

    async down(queryInterface, Sequelize) {
        // Xóa FK user_id
        await queryInterface.sequelize.query(`
            ALTER TABLE store.notifications
            DROP
            CONSTRAINT IF EXISTS fk_notifications_user_id;
        `);

        // Xóa FK brand_id
        await queryInterface.sequelize.query(`
            ALTER TABLE store.notifications
            DROP
            CONSTRAINT IF EXISTS fk_notifications_brand_id;
        `);
    }
};
