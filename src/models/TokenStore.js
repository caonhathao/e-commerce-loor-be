module.exports = (sequelize, DataTypes) => {
    const TokenStore = sequelize.define('TokenStore', {
                id: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                    allowNull: false
                },
                user_id: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                user_type: {
                    type: DataTypes.ENUM('user','brand'),
                    allowNull: false,
                },
                refresh: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                user_agent: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    defaultValue: 'Unknown'
                },
                IP: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                expiredAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                }
            }, {
                tableName: 'token_store',
                schema: 'store',
                timestamps: true,
            }
        )
    ;

    TokenStore.associate = (models) => {
        TokenStore.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'users',
        })
        TokenStore.belongsTo(models.Brands, {
            foreignKey: 'user_id',
            as: 'brands',
        })
    }

    return TokenStore;
}