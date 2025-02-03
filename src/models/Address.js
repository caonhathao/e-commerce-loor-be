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
            foreignKey: 'user_id',
            as: 'users',
        })
        Address.belongsTo(models.brands, {
            foreignKey: 'brand_id',
            as: 'brand',
        })
    }
    return Address;
}
