const {Sequelize} = require("sequelize");
const {nanoid} = require("nanoid");
module.exports = (sequelize, DataTypes) => {
    const Products = sequelize.define('Products', {
                id: {
                    type: DataTypes.STRING,
                    allowNull: false,
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
                        model: 'sub_categories',
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
                description: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                average_price: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.ENUM('OPENED','CLOSED'),
                    allowNull: true,
                    defaultValue: 'CLOSED',
                },
                stock: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                other_variant: {
                    type: DataTypes.BOOLEAN,
                    allowNull:
                        false,
                    defaultValue:
                        false,
                },
                promotion: {
                    type: DataTypes.INTEGER,
                    allowNull:
                        true,
                    defaultValue:
                        0,
                },
                tags: {
                    type: DataTypes.ARRAY(DataTypes.STRING),
                    allowNull:
                        true
                },
                pro_tsv: {
                    type: DataTypes.TSVECTOR,
                    allowNull: true,
                },
            },
            {
                tableName: 'products',
                schema: 'store',
                timestamps: true,
                hooks: {
                    beforeCreate: (product, options) => {
                        product.id = nanoid(10); // sinh chuỗi mặc định dài 21 ký tự
                    }
                }
            }
        )
    ;

    Products.associate = (models) => {

        Products.hasMany(models.ImageProduct, {
            foreignKey: 'product_id',
            as: 'image_products',
        })

        Products.hasMany(models.ProductVariants, {
            foreignKey: 'product_id',
            as: 'product_variants',
        })

        Products.hasMany(models.reviews, {
            foreignKey: 'product_id',
            as: 'reviews',
        })

        Products.belongsTo(models.Category, {
            foreignKey: 'category_id',
            as: 'categories'
        });

        Products.belongsTo(models.SubCategory, {
            foreignKey: 'subcategory_id',
            as: 'sub_categories'
        });

        Products.belongsTo(models.Brands, {
            foreignKey: 'brand_id',
            as: 'brands'
        });
    };

    return Products;
};
