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
            name_att: {
                type: Sequelize.STRING,
                allowNull: false
            },
            value_att: {
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
        await queryInterface.dropTable({schema: 'store', tableName: 'product_attribute'});
    }
};
