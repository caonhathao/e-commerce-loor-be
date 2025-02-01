module.exports = (sequelize, DataTypes) => {
    const Orders = sequelize.define('orders', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'users',
                key: 'ID',
            },
            onDelete: 'CASCADE',
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'DELIVERING', 'CANCELED', 'ABORTED'),
            allowNull: false,
        },
        createat:{
            type: DataTypes.DATE,
            allowNull: false,
            default:DataTypes.NOW
        }
    },{
        tableName: 'orders',
        timestamps:false
    });

    Orders.associate = (models) => {
        Orders.belongsTo(models.users, {
            foreignKey: 'user_id',
            as: 'users',
        })
        Orders.hasMany(models.orderDetail, {
            foreignKey: 'id',
            as: 'OrderDetail',
        })
    };
    return Orders;
};