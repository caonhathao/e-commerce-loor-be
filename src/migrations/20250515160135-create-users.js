'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable({schema: 'store', tableName: 'users'}, {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },
            image_link: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            full_name: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            account_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            birthday: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            gender:{
                type: Sequelize.ENUM('MALE', 'FEMALE', 'OTHER'),
                allowNull: true,
                defaultValue: 'OTHER',
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            numberphone: {
                type: Sequelize.STRING(11),
                allowNull: true,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            is_locked: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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
        await queryInterface.dropTable({schema: 'store', tableName: 'users'});
    }
};
