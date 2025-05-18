const {nanoid}=require('nanoid');

module.exports = (sequelize, DataTypes) => {
    const ShippingAddress = sequelize.define('shipping_address', {
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
        is_default: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        }
    },{
        tableName: 'shipping_address',
        schema: 'store',
        hooks: {
            beforeCreate: (shipping_address, options) => {
                shipping_address.id = nanoid(10); // sinh chuỗi mặc định dài 21 ký tự
            }
        }
    })
    return ShippingAddress;
}