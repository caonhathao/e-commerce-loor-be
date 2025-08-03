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
            references: {
                model: 'product_variants',
                key: 'id',
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
    }, {
        tableName: 'order_detail',
        schema: 'store',
        timestamps: true,
    });

    OrderDetail.associate = (models) => {
        OrderDetail.belongsTo(models.Orders, {
            foreignKey: 'order_id',
            as: 'Orders',
        })
        OrderDetail.belongsTo(models.ProductVariants,{
            foreignKey: 'variant_id',
            as: 'ProductVariants',
        })
    }

    return OrderDetail
}