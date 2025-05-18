module.exports = (sequelize, DataTypes) => {
    const OrderDetail = sequelize.define('OrderDetail', {
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
        variant_id:{
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'product_variants',
                key: 'sku',
            }
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
        tableName: 'order_detail',
        schema: 'store',
        timestamps: false,
        id:false
    });

    OrderDetail.associate = (models) => {
        OrderDetail.belongsTo(models.Orders, {
            foreignKey: 'order_id',
            as: 'orders',
        })
    }

    return OrderDetail
}