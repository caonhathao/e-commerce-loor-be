'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable({schema: 'store', tableName: 'bill_payment'}, {
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
            }
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable({schema: 'store', tableName: 'bill_payment'});
    }
};
