module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('categories', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },{
        tableName: 'categories',
        timestamps: false,
    });
    Category.associate = (models) => {
        Category.hasMany(models.products, {
            foreignKey: 'product_category_fk',
            as: 'products',
        })
        Category.hasMany(models.subCategories, {
            foreignKey: 'subcategory_category_fk',
            as: 'subCategories',
        })
    }
    return Category;
}