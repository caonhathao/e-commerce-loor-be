'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            ALTER TABLE store.chats
                ADD CONSTRAINT fk_chats_user_id
                    FOREIGN KEY (user_id)
                        REFERENCES store.users (id)
                        ON DELETE CASCADE
                        ON UPDATE CASCADE
        `)
        await queryInterface.sequelize.query(`
            ALTER TABLE store.chats
                ADD CONSTRAINT fk_chats_brand_id
                    FOREIGN KEY (brand_id)
                        REFERENCES store.brands (id)
                        ON DELETE CASCADE
                        ON UPDATE CASCADE
        `)
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            ALTER TABLE store.chats
            DROP
            CONSTRAINT IF EXISTS fk_chats_user_id`)
        await queryInterface.sequelize.query(`
            ALTER TABLE store.chats
            DROP
            CONSTRAINT IF EXISTS fk_chats_brand_id
        `)
    }
};
