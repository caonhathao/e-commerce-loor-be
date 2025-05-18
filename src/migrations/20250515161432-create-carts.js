'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable({schema: 'store', tableName: 'carts'}, {
            id: {
                type: Sequelize.STRING, primaryKey: true, allowNull: false,
            }, user_id: {
                allowNull: false,
                type: Sequelize.STRING,
            }, product_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable({schema: 'store', tableName: 'carts'});
    }
};
