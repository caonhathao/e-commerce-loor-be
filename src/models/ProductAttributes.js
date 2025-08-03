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
    })

    ProductAttribute.associate = (models) => {
        ProductAttribute.belongsTo(models.ProductVariants, {
            foreignKey: 'variant_id',
            as: 'ProductVariants',
        })
    }
    return ProductAttribute;
}