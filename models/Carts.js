module.exports = (sequelize, DataTypes) => {
    const Carts = sequelize.define("carts", {
        user_id: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: "users",
                key: 'ID',
            },
            onDelete: "CASCADE",
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "products",
                key: 'ID',
            }
        },
    },{
        tableName: 'carts',
    });

    Carts.associate = (models) => {
        Carts.belongsTo(models.users, {
            foreignKey: 'cart_user_id',
            as: 'users',
        })
        Carts.belongsTo(models.products, {
            foreignKey: 'cart_product_id',
            as: 'products',
        })
    }
    return Carts;
}