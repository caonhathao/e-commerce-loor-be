module.exports = (sequelize, DataTypes) => {
    const Products = sequelize.define('products', {
        ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'categories',
                key: 'ID',
            },
        },
        subCategory_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'subcategories',
                key: 'ID',
            },
        },
        brand_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'brands',
                key: 'ID',
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

        Products.hasMany(models.imageproducts, {
            foreignKey: 'product_id',
            as: 'imageproducts',
        })

        Products.hasOne(models.carts, {
            foreignKey: 'product_id',
            as: 'carts',
        })

        Products.hasOne(models.reviews, {
            foreignKey: 'product_id',
            as: 'reviews',
        })

        Products.belongsTo(models.categories, {foreignKey: 'category_id', as: 'categories'});

        Products.belongsTo(models.subcategories, {foreignKey: 'subCategory_id', as: 'subCategory'});

        Products.belongsTo(models.brands, {foreignKey: 'brand_id', as: 'brand'});
    };

    return Products;
};
