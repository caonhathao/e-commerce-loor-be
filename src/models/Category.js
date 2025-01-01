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
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'none',
        }
    }, {
        tableName: 'categories',
        schema: 'store',
        timestamps: false,
    });
    Category.associate = (models) => {
        Category.hasMany(models.subCategories, {
            foreignKey: 'category_id',
            as: 'subCategories',
        })
        Category.hasMany(models.products, {
            foreignKey: 'category_id',
            as: 'products',
        })
    }
    return Category;
}