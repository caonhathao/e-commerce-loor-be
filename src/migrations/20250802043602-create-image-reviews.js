'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable({schema: 'store', tableName: 'image_reviews'}, {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      review_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'reviews',
          key: 'id'
        }
      },
      image_link: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable({schema: 'store', tableName: 'image_reviews'});
  }
};
