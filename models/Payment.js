module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('payment', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: 'id',
            },
            onDelete: "CASCADE",
        },
        payment: {
            type: DataTypes.ENUM('COD', 'OP'),
            allowNull: false,
            defaultValue: 'COD',
        }
    })

    Payment.associate = (models) => {
        Payment.belongsTo(models.user, {
            foreignKey: 'ID',
            as: 'user',
        })
    }

    return Payment;
}