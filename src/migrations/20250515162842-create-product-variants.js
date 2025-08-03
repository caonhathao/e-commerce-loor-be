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
            name: {
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
            status: {
                type: Sequelize.ENUM('IN_STOCK', 'OUT_OF_STOCK', 'PRE_ORDER'),
                allowNull: 'OUT_OF_STOCK',
            },
            has_attribute: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            image_link: {
                type: Sequelize.STRING,
                allowNull: false,
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
        await queryInterface.dropTable({schema: 'store', tableName: 'product_variants'});
    }
};
