module.exports = (sequelize, DataTypes) => {
    const OrderStatus = sequelize.define('OrderStatus', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        status_code:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        status_name:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        status_mean:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        status_color:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        priority_order:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        authority:{
            type:DataTypes.ENUM('ROLE_USER','ROLE_VENDOR','ROLE_MANAGER','ROLE_SHIPPER','ROLE_SYSTEM'),
            allowNull:false,
        }
    },{
        tableName: 'order_status',
        schema: 'store',
        timestamps: true,
    })
    return OrderStatus;
}