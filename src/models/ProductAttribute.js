const {nanoid} = require('nanoid');

module.exports = (sequelize, DataTypes) => {
    const ProductAttribute = sequelize.define('ProductAttributes', {
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
        name_att: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value_att: {
            type: DataTypes.STRING,
            allowNull: false
        },

    }, {
        tableName: 'product_attribute',
        schema: 'store',
        timestamps: true,
        hooks: {
            beforeCreate: (product_attributes, options) => {
                product_attributes.id = nanoid(10); // sinh chuỗi mặc định dài 21 ký tự
            }
        }
    })
    return ProductAttribute;
}