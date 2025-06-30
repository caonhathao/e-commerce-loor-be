'use strict';

const {Sequelize} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable({schema: 'store', tableName: 'products'}, {
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            category_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            subcategory_id: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            brand_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            origin: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            average_price: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('OPENED','CLOSED'),
                allowNull: true,
                defaultValue: 'CLOSED',
            },
            stock: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            other_variant: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            promotion: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            tags: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                allowNull: true
            },
            pro_tsv: {
                type: Sequelize.TSVECTOR,
                allowNull: true,
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
        await queryInterface.dropTable({schema: 'store', tableName: 'products'});
    }
};
