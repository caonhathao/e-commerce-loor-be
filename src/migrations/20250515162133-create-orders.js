'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable({schema: 'store', tableName: 'orders'}, {
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
                unique: true
            },
            user_id: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            cost: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            fee: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: Sequelize.ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'DELIVERING', 'CANCELED', 'ABORTED','POSTPONED','REFUNDED','COMPLETE'),
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
            },
            updatedAt: {
                type: Sequelize.DATE,
            },
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable({schema: 'store', tableName: 'orders'});
    }
};
