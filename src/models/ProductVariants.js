const {nanoid} = require('nanoid');

module.exports = (sequelize, DataTypes) => {
    const ProductVariants = sequelize.define('ProductVariants', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING,
        },
        product_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id'
            },
            onDelete: 'CASCADE',
        },
        sku: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'product_variants',
        schema: 'store',
        hooks: {
            beforeCreate: (product_variant, options) => {
                product_variant.id = nanoid(10); // sinh chuỗi mặc định dài 21 ký tự
            }
        }
    });
    ProductVariants.associate = (models) => {
        ProductVariants.belongsTo(models.Products, {
            foreignKey: 'product_id',
            as: 'products',
        })
    }
    return ProductVariants;
}