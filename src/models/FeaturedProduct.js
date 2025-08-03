module.exports = (sequelize, DataTypes) => {
    const FeaturedProduct = sequelize.define('FeaturedProduct', {
            id: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true,
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
            product_views: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            product_wishlist: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            product_orders: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            }
        },
        {
            tableName: 'featured_product',
            schema: 'store',
            timestamps: true,
        });

    FeaturedProduct.associate = (models) => {
        FeaturedProduct.belongsTo(models.Products, {
            foreignKey: 'product_id',
            as: 'Products',
        })
    }
    return FeaturedProduct;
}