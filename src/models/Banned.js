module.exports = (sequelize, DataTypes) => {
    const Banned = sequelize.define('Banned', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE',
            primaryKey: true,
        },
        brand_id: {
            type: DataTypes.STRING,
            allowNull: true,
            references: {
                model: 'brands',
                key: 'id'
            },
            onDelete: 'CASCADE',
            primaryKey: true,
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rating: {
            type: DataTypes.ENUM('LOW', 'NORMAL', 'WARNING', 'HIGH', 'SERIOUS'),
            defaultValue: 'LOW',
            allowNull: false
        }
    }, {
        tableName: 'banned',
        timestamps: true,
        schema: 'store',
    });

    Banned.associate = (models) => {
        Banned.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'Users',
        })
        Banned.belongsTo(models.Brands, {
            foreignKey: 'brand_id',
            as: 'Brands',
        })
    };

    return Banned;
}
