module.exports = (sequelize, DataTypes) => {
    const Carts = sequelize.define("carts", {
        user_id: {
            allowNull: false,
            type: DataTypes.STRING,
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
            foreignKey: 'carts_user_fk',
            as: 'users',
        })
    }
    return Carts;
}