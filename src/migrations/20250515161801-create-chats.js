'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable({schema: 'store', tableName: 'chats'}, {
            user_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            brand_id: {
                type: Sequelize.STRING,
                allowNull: false,

            },
            content: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.TIME,
                allowNull: false,
            }
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable({schema: 'store', tableName: 'chats'});
    }
};
