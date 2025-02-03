module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('notifications', {
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        brand_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'brands',
                key: 'id'
            }
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('SUCCESS', 'WARNING', 'ERROR', 'Notification'),
            defaultValue: 'Notification',
            allowNull: false
        }
    }, {
        tableName: 'notifications',
    });

    Notification.associate = (models) => {
        Notification.belongsTo(models.users, {
            foreignKey: 'user_id',
            as: 'users'
        })
        Notification.belongsTo(models.brands, {
            foreignKey: 'brand_id',
            as: 'brands'
        })
    };
    return Notification;
}