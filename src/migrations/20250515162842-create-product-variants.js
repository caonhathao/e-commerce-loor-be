'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable({schema: 'store', tableName: 'product_variants'}, {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },
            product_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            sku: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            stock: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
            },
            updatedAt: {
                type: Sequelize.DATE,
            }
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable({schema: 'store', tableName: 'product_variants'});
    }
};
