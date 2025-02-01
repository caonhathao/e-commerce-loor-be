module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define('users', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING,
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
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
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
        },
        is_locked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    }, {
        tableName: 'users',
        timestamps: false
    });

    users.associate = (models) => {
        users.hasMany(models.addresses, {
            foreignKey: 'address_user_fk',
            as: 'address',
        })
        users.hasMany(models.payment, {
            foreignKey: 'payment_user_fk',
            as: 'payment',
        })
        users.hasMany(models.carts, {
            foreignKey: 'carts_user_fk',
            as: 'cart',
        })
        users.hasMany(models.reviews, {
            foreignKey: 'review_user_fk',
            as: 'reviews',
        })
        users.hasMany(models.notifications, {
            foreignKey: 'notifications_user_fk',
            as: 'notifications',
        })
        users.hasMany(models.orders, {
            foreignKey: 'user_id',
            as: 'orders',
        })
        users.hasOne(models.banned, {
            foreignKey: 'user_id',
            as: 'banned',
        })
    };

    return users;
}
