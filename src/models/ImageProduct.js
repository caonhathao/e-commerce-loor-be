module.exports = (sequelize, DataTypes) => {
    const ImageProduct = sequelize.define('imageProducts', {
        product_id: {
            type: DataTypes.INTEGER,
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
            foreignKey: 'images_product_fk',
            as: 'products',
        })
    }
    return ImageProduct;
}