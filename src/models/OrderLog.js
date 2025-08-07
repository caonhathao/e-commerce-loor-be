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
                model: 'Orders',
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
        tableName: 'order_log',
        schema: 'store',
        timestamps: true,
    });

    OrderLog.associate = (models) => {
        OrderLog.belongsTo(models.Orders, {
            foreignKey: 'order_id',
            as: 'Orders',
        })
    };
    return OrderLog;
};