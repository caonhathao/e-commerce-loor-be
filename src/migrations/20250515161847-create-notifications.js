'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable({schema: 'store', tableName: 'notifications'}, {
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
                type: Sequelize.DATE,
            },
            updatedAt: {
                type: Sequelize.DATE,
            },
            type: {
                type: Sequelize.ENUM('SUCCESS', 'WARNING', 'ERROR', 'Notification'),
                defaultValue: 'Notification',
                allowNull: false
            }
    
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable({schema: 'store', tableName: 'notifications'});
    }
};
