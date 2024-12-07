module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define('address', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "users",
                key: 'ID',
            },
            onDelete: "CASCADE",
        },
        brand_id:{
            type:DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "brand",
                key: 'ID',
            }
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },{
        tableName: 'addresses',
    });
    Address.associate = (models) => {
        Address.belongsTo(models.users, {
            foreignKey: 'ID',
            as: 'users',
        })
        Address.belongsTo(models.brands,{
            foreignKey: 'ID',
            as: 'brand',
        })
    }
    return Address;
}
