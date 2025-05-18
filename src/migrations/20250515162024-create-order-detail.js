'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable({schema: 'store', tableName: 'order_detail'}, {
            order_id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            variant_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            amount: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            cost: {
                type: Sequelize.INTEGER,
                allowNull: false,
            }

        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable({schema: 'store', tableName: 'order_detail'});
    }
};
