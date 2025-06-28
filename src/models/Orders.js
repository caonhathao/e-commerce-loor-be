module.exports = (sequelize, DataTypes) => {
    const Orders = sequelize.define('Orders', {
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
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'DELIVERING', 'CANCELED', 'ABORTED'),
            allowNull: false,
        },
    },{
        tableName: 'orders',
        schema: 'store',
    });

    Orders.associate = (models) => {
        Orders.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'users',
        })
        Orders.hasMany(models.OrderDetail, {
            foreignKey: 'id',
            as: 'OrderDetail',
        })
        Orders.hasOne(models.BillPayment, {
            foreignKey: 'order_id',
            as: 'BillPayment',
            }
        )
    };
    return Orders;
};