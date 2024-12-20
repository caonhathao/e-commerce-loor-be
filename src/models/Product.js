module.exports = (sequelize, DataTypes) => {
    const Products = sequelize.define('products', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        category_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'categories',
                key: 'id',
            },
        },
        subCategory_id: {
            type: DataTypes.STRING,
            allowNull: true,
            references: {
                model: 'subcategories',
                key: 'id',
            },
        },
        brand_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'brands',
                key: 'id',
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        origin: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('1', '0'),
            allowNull: true,
            defaultValue: '1',
        },
        promotion: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
    }, {
        tableName: 'products',
    });

    Products.associate = (models) => {

        Products.hasMany(models.imageProducts, {
            foreignKey: 'images_product_fk',
            as: 'imageProducts',
        })

        Products.hasMany(models.reviews, {
            foreignKey: 'review_product_fk',
            as: 'reviews',
        })

        Products.belongsTo(models.categories, {
            foreignKey: 'product_category_fk',
            as: 'categories'
        });

        Products.belongsTo(models.subCategories, {
            foreignKey: 'product_subcategory_fk',
            as: 'subCategory'
        });

        Products.belongsTo(models.brands, {
            foreignKey: 'product_ brand_fk',
            as: 'brands'
        });
    };

    return Products;
};
