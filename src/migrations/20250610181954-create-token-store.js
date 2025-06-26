'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable({schema: 'store', tableName: 'token_store'}, {
            id: {
                type: Sequelize.STRING, primaryKey: true, allowNull: false
            },
            user_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            user_type: {
                type: Sequelize.ENUM('user', 'brand'),
                allowNull: false,
            },
            refresh: {
                type: Sequelize.STRING, allowNull: false
            },
            user_agent: {
                type: Sequelize.STRING, allowNull: false, defaultValue: 'Unknown'
            },
            IP: {
                type: Sequelize.STRING, allowNull: false,
            },
            expiredAt: {
                type: Sequelize.DATE, allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE, allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE, allowNull: false,
            },
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable({schema: 'store', tableName: 'token_store'},)
    }
};
