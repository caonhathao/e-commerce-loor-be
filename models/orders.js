module.exports = (sequelize, DataTypes) => {
    const Orders = sequelize.define('orders', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'ID',
            },
            onDelete: 'CASCADE',
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'DELIVERING', 'CANCELED', 'ABORTED'),
            allowNull: false,
        }
    },{
        tableName: 'orders',
    });

    Orders.associate = (models) => {
        Orders.belongsTo(models.users, {
            foreignKey: 'orders_user_id',
            as: 'users',
        })
        Orders.hasMany(models.OrderDetail, {
            foreignKey: 'order_detail_id',
            as: 'OrderDetail',
        })
    };
    return Orders;
};