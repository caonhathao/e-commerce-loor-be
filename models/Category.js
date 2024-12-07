module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('categories', {
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },{
        tableName: 'categories',
    });
    Category.associate = (models) => {
        Category.hasMany(models.products, {
            foreignKey: 'ID',
            as: 'products',
        })
        Category.hasMany(models.subcategories, {
            foreignKey: 'ID',
            as: 'subcategories',
        })
    }
    return Category;
}