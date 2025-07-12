module.exports = (sequelize, DataTypes) => {
    const Provinces = sequelize.define('Provinces', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING,
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        type: {
            allowNull: false,
            type: DataTypes.ENUM('TINH', 'THANH_PHO_TRUC_THUOC_TW')
        },
        code_gso: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        region: {
            allowNull: false,
            type: DataTypes.ENUM('MIEN_BAC', 'MIEN_TRUNG', 'MIEN_NAM', 'MIEN_TAI')
        }
    }, {
        tableName: 'provinces',
        schema: 'store',
        timestamps: true,
    });
    Provinces.associate = (models) => {
        Provinces.hasMany(models.Districts, {
            foreignKey: 'province_id',
            as: 'districts',
        })
    }
    return Provinces;
}