module.exports = (sequelize, DataTypes) => {
    const OrderDetail = sequelize.define('OrderDetail', {
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'orders',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        product_id: {
            type: DataTypes.INTEGER,
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
            foreignKey: 'detail_order_id',
            as: 'orders',
        })
    }

    return OrderDetail
}