module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
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
        },
        image_link: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        tableName: 'category',
        schema: 'store',
        timestamps: false,
    });
    Category.associate = (models) => {
        Category.hasMany(models.SubCategory, {
            foreignKey: 'category_id',
            as: 'sub_category',
        })
        Category.hasMany(models.Products, {
            foreignKey: 'category_id',
            as: 'products',
        })
    }
    return Category;
}