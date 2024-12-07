module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define('users', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        account_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        birthday: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM('ROLE_USER', 'ROLE_BRAND', 'ROLE_MANAGER'),
            allowNull: false,
            defaultValue: 'ROLE_USER',
        },
        numberphone: {
            type: DataTypes.STRING(11),
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },{
        tableName: 'users',
        timestamps: false
    });

    users.associate = (models) => {
        users.hasMany(models.address, {
            foreignKey: 'address_user_id',
            as: 'address',
        })
        users.hasMany(models.payment, {
            foreignKey: 'payment_user_id',
            as: 'payment',
        })
        users.hasMany(models.carts, {
            foreignKey: 'user_id',
            as: 'cart',
        })
        users.hasMany(models.reviews,{
            foreignKey: 'user_id',
            as: 'review',
        })
        users.hasMany(models.notifications,{
            foreignKey: 'user_id',
            as: 'notify',
        })
        users.hasMany(models.orders,{
            foreignKey: 'orders_id',
            as: 'orders',
        })
    };

    return users;
}
