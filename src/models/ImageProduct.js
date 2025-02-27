module.exports = (sequelize, DataTypes) => {
    const ImageProduct = sequelize.define('imageProducts', {
        image_id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        product_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'products',
                key: 'ID',
            }
        },
        image_link: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'imageProducts',
        timestamps: false,
    });

    ImageProduct.removeAttribute('id');

    ImageProduct.associate = (models) => {
        ImageProduct.belongsTo(models.products, {
            foreignKey: 'product_id',
            as: 'products',
        });
    };

    return ImageProduct;
};
