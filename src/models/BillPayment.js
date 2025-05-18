const {nanoid} = require("nanoid");
module.exports = (sequelize, DataTypes) => {
    const BillPayment = sequelize.define('BillPayment', {
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
        }
    },{
        tableName: 'bill_payment',
        schema: 'store',
        hooks: {
            beforeCreate: (payment, options) => {
                payment.id = nanoid(10); // sinh chuỗi mặc định dài 21 ký tự
            }
        }
    });

    BillPayment.associate = (models) => {
        BillPayment.belongsTo(models.Users, {
            foreignKey: 'id',
            as: 'users',
        })
        BillPayment.belongsTo(models.Orders, {
            foreignKey: 'id',
            as: 'orders',
        })
    }

    return BillPayment;
}