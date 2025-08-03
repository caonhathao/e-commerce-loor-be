'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE store.image_reviews
        ADD CONSTRAINT fk_image_reviews_review_id
          FOREIGN KEY (review_id)
            REFERENCES store.reviews (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE;`)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
        ALTER TABLE store.image_reviews
            DROP CONSTRAINT IF EXISTS fk_image_reviews_review_id;`)
  }
};
