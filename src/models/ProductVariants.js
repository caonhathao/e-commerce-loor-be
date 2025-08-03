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
        name: {
            type: DataTypes.STRING,
            allowNull: false,
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
        },
        status: {
            type: DataTypes.ENUM('IN_STOCK', 'OUT_OF_STOCK', 'PRE_ORDER'),
            allowNull: 'OUT_OF_STOCK',
        },
        has_attribute: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image_link: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'product_variants',
        schema: 'store',
        timestamps: true,
    });
    ProductVariants.associate = (models) => {
        ProductVariants.belongsTo(models.Products, {
            foreignKey: 'product_id',
            as: 'Products',
        })
        ProductVariants.hasMany(models.ProductAttributes, {
            foreignKey: 'variant_id',
            as: 'ProductAttributes',
        })
        ProductVariants.hasMany(models.OrderDetail, {
            foreignKey: 'variant_id',
            as: 'OrderDetail',
        })
    }
    return ProductVariants;
}