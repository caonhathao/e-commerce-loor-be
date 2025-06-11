const { nanoid } = require('nanoid');

module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
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
            unique: true,
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
        schema: 'store',
        timestamps: true,
        hooks: {
            beforeCreate: (user, options) => {
                user.id = nanoid(10); // sinh chuỗi mặc định dài 21 ký tự
            }
        }
    });

    Users.associate = (models) => {
        Users.hasMany(models.BillPayment, {
            foreignKey: 'user_id',
            as: 'bill_payment',
        })
        Users.hasMany(models.Carts, {
            foreignKey: 'user_id',
            as: 'cart',
        })
        Users.hasMany(models.shopping_log, {
            foreignKey: 'user_id',
            as: 'shopping_log',
        })
        Users.hasMany(models.reviews, {
            foreignKey: 'user_id',
            as: 'reviews',
        })
        Users.hasMany(models.Notification, {
            foreignKey: 'user_id',
            as: 'notifications',
        })
        Users.hasMany(models.Orders, {
            foreignKey: 'user_id',
            as: 'orders',
        })
        Users.hasOne(models.Banned, {
            foreignKey: 'user_id',
            as: 'banned',
        })
        Users.hasMany(models.shipping_address, {
            foreignKey: 'user_id',
            as: 'shipping_address',
        })
    };

    return Users;
}
