module.exports = (sequelize, DataTypes) => {
    const Brand = sequelize.define('brands', {
        ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        email:{
            type:DataTypes.STRING,
            allowNull: false,
        },
        numberphone:{
            type:DataTypes.STRING,
            allowNull: false,
        }
    },{
        tableName: 'brands',
    });

    Brand.associate = (models) => {
        Brand.hasMany(models.address,{
            foreignKey: 'address_brand_id',
            as: 'address',
        })
        Brand.hasMany(models.ChatSupport,{
            foreignKey: 'chat_support_brand_id',
            as: 'chatSupport',
        })
    };
    return Brand;
}