const {nanoid} = require("nanoid");
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
                model: "orders",
                key: 'id',
            },
        },
        payment: {
            type: DataTypes.ENUM('COD', 'OP'),
            allowNull: false,
            defaultValue: 'COD',
        },
        payment_status: {
            type: DataTypes.ENUM('UNPAID', 'PAID', 'PENDING', 'CANCEL'),
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
        hooks: {
            beforeCreate: (payment, optionst) => {
                payment.id = nanoid(10); // sinh chuỗi mặc định dài 21 ký tự
            }
        }
    });

    Receipt.associate = (models) => {
        Receipt.belongsTo(models.Users, {
            foreignKey: 'id',
            as: 'users',
        })
        Receipt.belongsTo(models.Orders, {
            foreignKey: 'id',
            as: 'orders',
        })
    }

    return Receipt;
}