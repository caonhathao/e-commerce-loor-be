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
        }
    }, {
        tableName: 'shipping_address',
        schema: 'store',
        timestamps: false
    })

    ShippingAddress.associate = (models) => {
        ShippingAddress.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'Users',
        })
    }
    return ShippingAddress;
}