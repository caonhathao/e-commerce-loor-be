module.exports = (sequelize, DataTypes) => {
    const SubCategory = sequelize.define('subCategories', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        category_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'categories',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'subCategories',
    });

    SubCategory.associate = (models) => {
        SubCategory.belongsTo(models.categories, {
            foreignKey: 'subcategory_category_fk',
            as: 'categories',
        })
    };
    return SubCategory;
}