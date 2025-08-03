module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING,
        },
        image_link: {
            allowNull: true,
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
        gender: {
            type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
            allowNull: false,
            defaultValue: 'OTHER',
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        numberphone: {
            type: DataTypes.STRING(10),
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
    });

    Users.associate = (models) => {
        Users.hasOne(models.UserRoles, {
            foreignKey: 'user_id',
            as: 'UserRoles',
        })
        Users.hasMany(models.Receipt, {
            foreignKey: 'user_id',
            as: 'Receipt',
        })
        Users.hasMany(models.Carts, {
            foreignKey: 'user_id',
            as: 'Cart',
        })
        Users.hasMany(models.ShoppingLog, {
            foreignKey: 'user_id',
            as: 'shopping_log',
        })
        Users.hasMany(models.Reviews, {
            foreignKey: 'user_id',
            as: 'Reviews',
        })
        Users.hasMany(models.NotifyUser, {
            foreignKey: 'user_id',
            as: 'NotifyUser',
        })
        Users.hasMany(models.Orders, {
            foreignKey: 'user_id',
            as: 'Orders',
        })
        Users.hasOne(models.Banned, {
            foreignKey: 'user_id',
            as: 'Banned',
        })
        Users.hasMany(models.ShippingAddress, {
            foreignKey: 'user_id',
            as: 'ShippingAddress',
        })
    };

    return Users;
}
