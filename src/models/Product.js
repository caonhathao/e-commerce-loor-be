const {Sequelize} = require("sequelize");
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
        subcategory_id: {
            type: DataTypes.STRING,
            allowNull: true,
            references: {
                model: 'subcategories',
                key: 'id',
            },
        },
        brand_id: {
            type: DataTypes.STRING,
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
            type: DataTypes.ENUM('1', '0'), //1 is showing, 0 is disabled
            allowNull: true,
            defaultValue: '1',
        },
        promotion: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        tags: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pro_tsv: {
            type: Sequelize.literal('tsvector'),
            allowNull: true,
        }
    }, {
        tableName: 'products',
        timestamps: false
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
            foreignKey: 'category_id',
            as: 'categories'
        });

        Products.belongsTo(models.subCategories, {
            foreignKey: 'subcategory_id',
            as: 'subCategories'
        });

        Products.belongsTo(models.brands, {
            foreignKey: 'brand_id',
            as: 'brands'
        });
    };

    return Products;
};
