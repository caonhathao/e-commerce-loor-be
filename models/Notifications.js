module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('notifications', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'ID'
            }
        },
        brand_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'brands',
                key: 'ID'
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
    },{
        tableName: 'notifications',
    });

    Notification.associate = (models) => {
        Notification.belongsTo(models.users, {
            foreignKey: 'user_Notification_id',
            as: 'users'
        })
        Notification.belongsTo(models.brands, {
            foreignKey: 'brand_Notification_id',
            as: 'brands'
        })
    };
    return Notification;
}