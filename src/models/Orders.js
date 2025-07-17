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
        brand_id:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        shipping_type:{
          type:DataTypes.ENUM('GIAO_HANG_NHANH','GIAO_HANG_TIET_KIEM','GIAO HANG_HOA_TOC'),
            allowNull:false,
            defaultValue:'GIAO_HANG_NHANH',
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fee:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0,
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'DELIVERING', 'CANCELED', 'ABORTED','POSTPONED','REFUNDED','COMPLETE'),
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
            foreignKey: 'order_id',
            as: 'OrderDetail',
        })
        Orders.hasOne(models.Receipt, {
            foreignKey: 'order_id',
            as: 'receipt',
            }
        )
    };
    return Orders;
};