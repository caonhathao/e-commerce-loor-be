const {nanoid} = require("nanoid");
module.exports = (sequelize, DataTypes) => {
    const Carts = sequelize.define("Carts", {
        id: {
            type: DataTypes.STRING, primaryKey: true, allowNull: false,
        }, 
        user_id: {
            allowNull: false, type: DataTypes.STRING, references: {
                model: "users", key: 'id',
            }, onDelete: "CASCADE",
        }, 
        variant_id: {
            type: DataTypes.STRING, allowNull: false, references: {
                model: "product_variants", key: 'id',
            }
        },
        image_link: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        pinned: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
    }, {
        tableName: 'carts', schema: 'store', hooks: {
            beforeCreate: (carts, options) => {
                carts.id = nanoid(10); // sinh chuỗi mặc định dài 21 ký tự
            }
        }
    });

    Carts.associate = (models) => {
        Carts.belongsTo(models.Users, {
            foreignKey: 'user_id', as: 'users',
        })
        Carts.belongsTo(models.ProductVariants, {
            foreignKey: 'variant_id',
            as: 'product_variants',
        });
    }
    return Carts;
}