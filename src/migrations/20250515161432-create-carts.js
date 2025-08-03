'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable({schema: 'store', tableName: 'carts'}, {
            id: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            variant_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            amount: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            pinned: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')
            }
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable({schema: 'store', tableName: 'carts'});
    }
};
