const {nanoid} = require("nanoid");
module.exports = (sequelize, DataTypes) => {
    const Carts = sequelize.define("Carts", {
        id: {
            type: DataTypes.STRING, primaryKey: true, allowNull: false,
        },
        user_id: {
            allowNull: false, type: DataTypes.STRING, references: {
                model: "users", key: 'id',
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        variant_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "product_variants",
                key: 'id',
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
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
        tableName: 'carts',
        schema: 'store',
        timestamps: true
    });

    Carts.associate = (models) => {
        Carts.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'Users',
        })
        Carts.belongsTo(models.ProductVariants, {
            foreignKey: 'variant_id',
            as: 'ProductVariants',
        });
    }
    return Carts;
}