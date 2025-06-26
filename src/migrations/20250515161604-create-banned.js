'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable({schema: 'store', tableName: 'banned'}, {
            id: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            brand_id: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            reason: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
            },
            updatedAt: {
                type: Sequelize.DATE,
            },
            rating: {
                type: Sequelize.ENUM('LOW', 'NORMAL', 'WARNING', 'HIGH', 'SERIOUS'),
                defaultValue: 'LOW',
                allowNull: false
            }
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable({schema: 'store', tableName: 'banned'});
    }
};
