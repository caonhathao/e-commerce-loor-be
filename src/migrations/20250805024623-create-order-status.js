'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable({schema: 'store', tableName: 'order_status'}, {
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            status_code: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            status_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            status_mean: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            status_color: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            priority_order: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            authority: {
                type: Sequelize.ENUM('ROLE_USER', 'ROLE_VENDOR', 'ROLE_MANAGER', 'ROLE_SHIPPER', 'ROLE_SYSTEM'),
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Date.now()
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Date.now()
            },
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable({schema: 'store', tableName: 'order_status'});
    }
};
