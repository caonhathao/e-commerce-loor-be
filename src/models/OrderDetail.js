module.exports = (sequelize, DataTypes) => {
    const OrderDetail = sequelize.define('OrderDetail', {
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
        },
        variant_id: {
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
    }, {
        tableName: 'order_detail',
        schema: 'store',
    });

    OrderDetail.associate = (models) => {
        OrderDetail.belongsTo(models.Orders, {
            foreignKey: 'order_id',
            as: 'orders',
        })
    }

    return OrderDetail
}