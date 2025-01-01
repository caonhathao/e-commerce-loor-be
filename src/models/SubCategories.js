module.exports = (sequelize, DataTypes) => {
    const SubCategories = sequelize.define('subCategories', {
        id: {
            type: DataTypes.STRING,
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
        },
        description: {
            type:DataTypes.STRING,
            allowNull: false,
            defaultValue: 'none',
        }
    }, {
        tableName: 'subCategories',
        schema:'store',
        timestamps:false,
    });

    SubCategories.associate = (models) => {
        SubCategories.belongsTo(models.categories, {
            foreignKey: 'category_id',
            as: 'category',
        })
        SubCategories.hasMany(models.products, {
            foreignKey: 'subcategory_id',
            as:'products',
        })
    };
    return SubCategories;
}