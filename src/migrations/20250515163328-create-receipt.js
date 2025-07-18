'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable({schema: 'store', tableName: 'receipt'}, {
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            user_id: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: "users",
                    key: 'id',
                },
                onDelete: "CASCADE",
            },
            order_id: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: "orders",
                    key: 'id',
                },
            },
            payment: {
                type: Sequelize.ENUM('COD', 'OP'),
                allowNull: false,
                defaultValue: 'COD',
            },
            payment_status: {
                type: Sequelize.ENUM('UNPAID', 'PAID', 'PENDING', 'REFUNDED','CANCELED'),
                allowNull: false,
                defaultValue: 'PENDING',
            },
            reason: {
                type: Sequelize.STRING,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable({schema: 'store', tableName: 'receipt'});
    }
};
