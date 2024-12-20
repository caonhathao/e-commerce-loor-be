module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define('addresses', {
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "users",
                key: 'id',
            },
            onDelete: "CASCADE",
        },
        brand_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "brands",
                key: 'id',
            }
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        tableName: 'addresses',
    });
    Address.associate = (models) => {
        Address.belongsTo(models.users, {
            foreignKey: 'address_user_fk',
            as: 'users',
        })
        Address.belongsTo(models.brands, {
            foreignKey: 'address_brand_fk',
            as: 'brand',
        })
    }
    return Address;
}
