'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable({schema: 'store', tableName: 'sub_category'}, {
            id: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false,
            },
            category_id: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'category',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false,
                defaultValue: 'none',
            },
            image_link: {
                type: Sequelize.STRING,
                allowNull: true,
            }
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable({schema: 'store', tableName: 'sub_category'});
    }
};
