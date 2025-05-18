const {nanoid} = require("nanoid");

module.exports = (sequelize, DataTypes) => {
    const ShoppingLog = sequelize.define('shopping_log', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            }
        },
        order_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        total:{
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },{
        tableName: 'shopping_log',
        schema: 'store',
        hooks: {
            beforeCreate: (ShoppingLog, options) => {
                ShoppingLog.id = nanoid(10); // sinh chuỗi mặc định dài 21 ký tự
            }
        }
    })
    return ShoppingLog;
}