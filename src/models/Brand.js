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
        address: {
            type: DataTypes.STRING,
            allowNull: true,
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
        Brand.hasMany(models.Chats, {
            foreignKey: 'brand_id',
            as: 'chatSupport',
        })
        Brand.hasMany(models.products, {
            foreignKey: 'brand_id',
            as: 'products',
        })
        Brand.hasMany(models.notifications, {
            foreignKey: 'brand_id',
            as: 'notifications',
        })
        Brand.hasOne(models.banned, {
            foreignKey: 'brand_id',
            as: 'banned',
        })
    };
    return Brand;
}