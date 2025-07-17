'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable({schema: 'store', tableName: 'brands'}, {
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            image_link: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true,
                unique: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
                defaultValue: 'none',
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            numberphone: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            address: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            is_locked: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
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
        await queryInterface.dropTable({schema: 'store', tableName: 'brands'});
    }
};
