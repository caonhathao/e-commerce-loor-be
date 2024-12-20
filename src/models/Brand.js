module.exports = (sequelize, DataTypes) => {
    const Brand = sequelize.define('brands', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        numberphone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_locked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        tableName: 'brands',
        timestamps: false,
    });

    Brand.associate = (models) => {
        Brand.hasMany(models.addresses, {
            foreignKey: 'address_brand_fk',
            as: 'address',
        })
        Brand.hasMany(models.Chats, {
            foreignKey: 'chat_support_brand_fk',
            as: 'chatSupport',
        })
        Brand.hasMany(models.products, {
            foreignKey: 'product_ brand_fk',
            as: 'products',
        })
        Brand.hasMany(models.notifications, {
            foreignKey: 'notifications_brand_fk',
            as: 'notifications',
        })
        Brand.hasOne(models.banned, {
            foreignKey: 'brand_id',
            as: 'banned',
        })
    };
    return Brand;
}