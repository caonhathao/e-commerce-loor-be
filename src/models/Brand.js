module.exports = (sequelize, DataTypes) => {
    const Brand = sequelize.define('Brands', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        image_link: {
            type:DataTypes.STRING,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
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
        schema: 'store',
    });

    Brand.associate = (models) => {
        Brand.hasMany(models.Chats, {
            foreignKey: 'brand_id',
            as: 'chatSupport',
        })
        Brand.hasMany(models.Products, {
            foreignKey: 'brand_id',
            as: 'products',
        })
        Brand.hasOne(models.Banned, {
            foreignKey: 'brand_id',
            as: 'banned',
        })
    };
    return Brand;
}