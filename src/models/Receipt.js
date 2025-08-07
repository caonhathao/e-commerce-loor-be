module.exports = (sequelize, DataTypes) => {
    const Receipt = sequelize.define('Receipt', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "users",
                key: 'id',
            },
            onDelete: "CASCADE",
        },
        order_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "Orders",
                key: 'id',
            },
        },
        payment: {
            type: DataTypes.ENUM('COD', 'OP'),
            allowNull: false,
            defaultValue: 'COD',
        },
        payment_status: {
            type: DataTypes.ENUM('UNPAID', 'PAID', 'PENDING', 'REFUNDED','CANCELED'),
            allowNull: false,
            defaultValue: 'PENDING',
        },
        reason: {
            type: DataTypes.STRING,
        }
    }, {
        tableName: 'receipt',
        timestamps: true,
        schema: 'store',
    });

    Receipt.associate = (models) => {
        Receipt.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'Users',
        })
        Receipt.belongsTo(models.Orders, {
            foreignKey: 'order_id',
            as: 'Orders',
        })
    }

    return Receipt;
}