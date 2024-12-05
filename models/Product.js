module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('product', {
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
                model: 'Categories',
                key: 'ID',
            },
        },
        subCategory_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'SubCategories',
                key: 'ID',
            },
        },
        brand_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Brands',
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
    });

    Product.associate = (models) => {

        Product.belongsTo(models.category, { foreignKey: 'category_id', as: 'category' });

        Product.belongsTo(models.subcategory, { foreignKey: 'subCategory_id', as: 'subCategory' });

        Product.belongsTo(models.brand, { foreignKey: 'brand_id', as: 'brand' });
    };

    return Product;
};
