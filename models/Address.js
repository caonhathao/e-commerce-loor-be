module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define('address', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: 'id',
            },
            onDelete: "CASCADE",
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    });
    Address.associate = (models) => {
        Address.belongsTo(models.user, {
            foreignKey: 'ID',
            as: 'user',
        })
    }
    return Address;
}
