'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
// Add FK: carts.product_id → products.id
    await queryInterface.addConstraint(
        { schema: 'store', tableName: 'carts' },
        {
          fields: ['variant_id'],
          type: 'foreign key',
          name: 'fk_carts_variant_id',
          references: {
            table: { schema: 'store', tableName: 'product_variants' },
            field: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }
    );

    // Add FK: carts.user_id → users.id
    await queryInterface.addConstraint(
        { schema: 'store', tableName: 'carts' },
        {
          fields: ['user_id'],
          type: 'foreign key',
          name: 'fk_carts_user_id',
          references: {
            table: {schema:'store',tableName:'users'}, // Không có schema, dùng public
            field: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }
    );
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.removeConstraint({ schema: 'store', tableName: 'carts' }, 'fk_carts_variant_id');
      await queryInterface.removeConstraint({ schema: 'store', tableName: 'carts' }, 'fk_carts_user_id');
  }
};
