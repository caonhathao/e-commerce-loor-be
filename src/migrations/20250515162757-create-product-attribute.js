'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable({schema: 'store', tableName: 'product_attribute'}, {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },
            variant_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            attJson: {
                type: Sequelize.JSON,
                allowNull: false,
            }
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable({schema: 'store', tableName: 'product_attribute'});
    }
};
