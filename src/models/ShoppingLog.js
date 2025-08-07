module.exports = (sequelize, DataTypes) => {
    const ShoppingLog = sequelize.define('ShoppingLog', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            }
        },
        order_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        total: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'shopping_log',
        schema: 'store'
    })
    return ShoppingLog;
}