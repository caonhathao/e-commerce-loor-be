module.exports = (sequelize, DataTypes) => {
    const banned = sequelize.define('banned', {
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
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        rating: {
            type: DataTypes.ENUM('LOW', 'NORMAL', 'WARNING', 'HIGH', 'SERIOUS'),
            defaultValue: 'LOW',
            allowNull: false
        }
    }, {
        tableName: 'banned',
        primaryKey: false,
        timestamps: false,
        id: false
    });

    banned.associate = (models) => {
        banned.belongsTo(models.users, {
            foreignKey: 'user_id',
            as: 'users',
        })
        banned.belongsTo(models.brands, {
            foreignKey: 'brand_id',
            as: 'brands',
        })
    };

    return banned;
}
