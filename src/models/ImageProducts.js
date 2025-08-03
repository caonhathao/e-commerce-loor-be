module.exports = (sequelize, DataTypes) => {
    const ImageProducts = sequelize.define('ImageProducts', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        image_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        product_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id',
            }
        },
        image_link: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'image_products',
        timestamps: false,
        schema: 'store',
    });

    ImageProducts.associate = (models) => {
        ImageProducts.belongsTo(models.Products, {
            foreignKey: 'product_id',
            as: 'Products',
        });
    };

    return ImageProducts;
};
