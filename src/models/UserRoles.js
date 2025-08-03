module.exports = (sequelize, DataTypes) => {
    const UserRoles = sequelize.define('UserRoles', {
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
                onUpdate: 'CASCADE',
            },
            role: {
                type: DataTypes.ENUM('ROLE_USER', 'ROLE_BRAND', 'ROLE_MANAGER'),
                allowNull: false,
                defaultValue: 'ROLE_USER',
            }
        },
        {
            tableName: 'user_roles',
            timestamps: true,
        });

    UserRoles.associate = (models) => {
        UserRoles.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'Users',
        })
    }
    return UserRoles;
}