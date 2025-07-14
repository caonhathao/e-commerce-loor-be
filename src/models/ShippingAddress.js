const {nanoid} = require('nanoid');

module.exports = (sequelize, DataTypes) => {
    const ShippingAddress = sequelize.define('ShippingAddress', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING,
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ward: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Vietnam',
        },
        zipcode: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '0'
        },
        is_default: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            unique: true,
        }
    }, {
        tableName: 'shipping_address',
        schema: 'store',
        hooks: {
            beforeCreate: (shipping_address, options) => {
                shipping_address.id = nanoid(10); // sinh chuỗi mặc định dài 21 ký tự
            }
        },
        timestamps: false
    })

    ShippingAddress.associate = (models) => {
        ShippingAddress.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'users',
        })
    }
    return ShippingAddress;
}