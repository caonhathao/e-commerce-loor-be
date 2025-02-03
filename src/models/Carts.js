module.exports = (sequelize, DataTypes) => {
    const Carts = sequelize.define("carts", {
        user_id: {
            allowNull: false,
            type: DataTypes.STRING,
            references: {
                model: "users",
                key: 'id',
            },
            onDelete: "CASCADE",
        },
        product_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "products",
                key: 'id',
            }
        },
    },{
        tableName: 'carts',
    });

    Carts.associate = (models) => {
        Carts.belongsTo(models.users, {
            foreignKey: 'user_id',
            as: 'users',
        })
    }
    return Carts;
}