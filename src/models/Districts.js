module.exports = (sequelize, DataTypes) => {
    const Districts = sequelize.define('Districts', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING,
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        province_id: {
            allowNull: false,
            type: DataTypes.STRING,
            references: {
                modelName:'store',
                model: 'provinces',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        code_gso: {
            allowNull: false,
            type: DataTypes.STRING,
        }
    }, {
        tableName: 'districts',
        schema: 'store',
        timestamps: true,
    });
    Districts.associate = (models) => {
        Districts.belongsTo(models.Provinces, {
            foreignKey: 'province_id',
            as: 'province',
        })
    }

    return Districts;
}