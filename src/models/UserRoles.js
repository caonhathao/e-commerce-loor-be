const {nanoid} = require('nanoid');

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('UserRoles', {
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
            hooks: {
                beforeCreate: (userRoles, options) => {
                    userRoles.id = nanoid(10); // sinh chuỗi mặc định dài 21 ký tự
                }
            }
        });
}