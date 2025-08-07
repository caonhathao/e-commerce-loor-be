module.exports = (sequelize, DataTypes) => {
    const OrderLog = sequelize.define('OrderLog', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        order_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'orders',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('SENDER', 'DELIVERING', 'SHIPPING', 'RECEIVER'),
            allowNull: false,
        }
    }, {
        tableName: 'order-log',
        schema: 'store',
        timestamps: true,
    });

    OrderLog.associate = (models) => {
        OrderLog.hasMany(models.Orders, {
            foreignKey: 'order_id',
            as: 'Orders',
        })
    };
    return OrderLog;
};