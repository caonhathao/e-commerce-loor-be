'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable({schema:'store',tableName:'user_roles'},{
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        }
      },
      role: {
        type: Sequelize.ENUM('ROLE_USER', 'ROLE_BRAND', 'ROLE_MANAGER'),
        allowNull: false,
        defaultValue: 'ROLE_USER',
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable({ schema: 'store', tableName: 'user_roles' });
  }
};
