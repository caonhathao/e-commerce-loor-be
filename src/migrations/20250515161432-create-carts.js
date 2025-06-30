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
            image_link: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            amount: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            cost: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            pinned: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false,
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
        await queryInterface.dropTable({schema: 'store', tableName: 'carts'});
    }
};
