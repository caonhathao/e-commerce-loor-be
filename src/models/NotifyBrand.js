module.exports = (sequelize, DataTypes) => {
    const NotifyBrand = sequelize.define('NotifyBrand', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        brand_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'brands',
                key: 'id'
            }
        },
        title:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        redirect_url: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.ENUM('SUCCESS', 'WARNING', 'ERROR', 'BAN', 'ORDER', 'ADS', 'NOTICE'),
            defaultValue: 'NOTICE',
            allowNull: false
        },
        status:{
            type:DataTypes.ENUM("READ","IDLE"),
            defaultValue:"IDLE",
            allowNull:false,
        }
    }, {
        tableName: 'notify_brand',
        schema: 'store',
    });

    NotifyBrand.associate = (models) => {
        NotifyBrand.belongsTo(models.Users, {
            foreignKey: 'brand_id',
            as: 'brands'
        })
    };
    return NotifyBrand
        ;
}