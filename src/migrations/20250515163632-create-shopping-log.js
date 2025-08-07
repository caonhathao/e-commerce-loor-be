'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
await queryInterface.createTable({schema: 'store', tableName: 'shopping_log'}, {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  user_id: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  order_id: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  total:{
    type: Sequelize.INTEGER,
    allowNull: false,
  }
})
  },

  async down (queryInterface, Sequelize) {
await queryInterface.dropTable({schema: 'store', tableName: 'shopping_log'});
  }
};
