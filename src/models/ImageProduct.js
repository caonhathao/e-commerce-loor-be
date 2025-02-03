module.exports = (sequelize, DataTypes) => {
    const ImageProduct = sequelize.define('imageProducts', {
        product_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'products',
                key: 'ID',
            },
            onDelete: "CASCADE",
        },
        image_link: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },{
        tableName: 'imageProducts',
    });

    ImageProduct.associate = (models) => {
        ImageProduct.belongsTo(models.products, {
            foreignKey: 'product_id',
            as: 'products',
        })
    }
    return ImageProduct;
}