module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('user', {
        ID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        account_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        birthday: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('ROLE_USER', 'ROLE_BRAND', 'ROLE_MANAGER'),
            allowNull: false,
        },
        numberphone: {
            type: DataTypes.STRING(12),
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    Users.associate = (models) => {
        Users.hasMany(models.address, {
            foreignKey: 'user_id',
            as: 'address',
        })
    };

    return Users;
}
