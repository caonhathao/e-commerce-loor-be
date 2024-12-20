module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('payment', {
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "users",
                key: 'ID',
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
            foreignKey: 'payment_user_fk',
            as: 'users',
        })
    }

    return Payment;
}