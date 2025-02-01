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
            primaryKey: true,
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
    },{
        tableName: 'orderDetail',
        timestamps: false,
        id:false
    });

    OrderDetail.associate = (models) => {
        OrderDetail.belongsTo(models.orders, {
            foreignKey: 'order_id',
            as: 'orders',
        })
    }

    return OrderDetail
}