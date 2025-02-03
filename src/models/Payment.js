module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('payment', {
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "users",
                key: 'id',
            },
            onDelete: "CASCADE",
        },
        payment: {
            type: DataTypes.ENUM('COD', 'OP'),
            allowNull: false,
            defaultValue: 'COD',
        }
    },{
        tableName: 'payment',
    });

    Payment.associate = (models) => {
        Payment.belongsTo(models.users, {
            foreignKey: 'user_id',
            as: 'users',
        })
    }

    return Payment;
}