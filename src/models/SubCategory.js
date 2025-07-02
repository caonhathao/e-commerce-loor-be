module.exports = (sequelize, DataTypes) => {
    const SubCategory = sequelize.define('SubCategory', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        category_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'category',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: 'none',
        },
        image_link: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        tableName: 'sub_category',
        schema: 'store',
        timestamps: false,
    });

    SubCategory.associate = (models) => {
        SubCategory.belongsTo(models.Category, {
            foreignKey: 'category_id',
            as: 'category',
        })
        SubCategory.hasMany(models.Products, {
            foreignKey: 'subcategory_id',
            as: 'products',
        })
    };
    return SubCategory;
}