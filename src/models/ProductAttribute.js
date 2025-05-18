const {nanoid} =require('nanoid');

module.exports = (sequelize, DataTypes) => {
    const ProductAttribute = sequelize.define('product_attributes', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING,
        },
        variant_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'product_variants',
                key: 'id'
            },
            onDelete: 'CASCADE',
        },
        attJson: {
            type: DataTypes.JSON,
            allowNull: false,
        }
    },{
        tableName: 'product_attributes',
        schema: 'store',
        hooks: {
            beforeCreate: (product_attributes, options) => {
                product_attributes.id = nanoid(10); // sinh chuỗi mặc định dài 21 ký tự
            }
        }
    })
    return ProductAttribute;
}