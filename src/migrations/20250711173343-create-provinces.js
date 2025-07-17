'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable({schema: 'store', tableName: 'provinces'}, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('TINH', 'THANH_PHO_TRUC_THUOC_TW')
      },
      code_gso: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      region: {
        allowNull: false,
        type: Sequelize.ENUM('MIEN_BAC', 'MIEN_TRUNG', 'MIEN_NAM', 'MIEN_TAI')
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
    await queryInterface.dropTable({schema: 'store', tableName: 'provinces'});
  }
};
