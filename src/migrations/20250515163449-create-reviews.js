'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable({schema: 'store', tableName: 'reviews'}, {
            id: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                }
            },
            product_id: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id',
                }
            },
            content: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            has_image: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            rating: {
                type: Sequelize.ENUM('1', '2', '3', '4', '5'),
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
        await queryInterface.dropTable({schema: 'store', tableName: 'reviews'});
    }
};
