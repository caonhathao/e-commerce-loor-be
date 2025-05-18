const {nanoid} = require("nanoid");
module.exports = (sequelize, DataTypes) => {
    const ImageProduct = sequelize.define('ImageProduct', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        image_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        product_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id',
            }
        },
        image_link: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'image_products',
        timestamps: false,
        schema: 'store',
        hooks: {
            beforeCreate: (ImageProduct, options) => {
                ImageProduct.id = nanoid(10); // sinh chuỗi mặc định dài 21 ký tự
            }
        }
    });

    ImageProduct.associate = (models) => {
        ImageProduct.belongsTo(models.Products, {
            foreignKey: 'product_id',
            as: 'products',
        });
    };

    return ImageProduct;
};
