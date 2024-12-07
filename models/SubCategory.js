module.exports = (sequelize, DataTypes) => {
    const SubCategory = sequelize.define('subcategories', {
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'categories',
                key: 'ID',
            },
            onDelete: 'CASCADE',
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'subcategories',
    });

    SubCategory.associate = (models) => {
        SubCategory.belongsTo(models.categories, {
            foreignKey: 'categories_id',
            as: 'categories',
        })
    };
    return SubCategory;
}