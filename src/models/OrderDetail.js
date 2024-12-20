module.exports = (sequelize, DataTypes) => {
    const OrderDetail = sequelize.define('orderDetail', {
        order_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'orders',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        product_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });

    OrderDetail.associate = (models) => {
        OrderDetail.belongsTo(models.orders, {
            foreignKey: 'orderDetails_order_fk',
            as: 'orders',
        })
    }

    return OrderDetail
}