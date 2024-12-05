module.exports = (sequelize,DataTypes)=>{
    const Carts=sequelize.define("cart",{
        user_id:{
            allowNull:false,
            type:DataTypes.INTEGER,
            references:{
                model:"user",
                key: 'id',
            },
            onDelete: "CASCADE",
        },
        product_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:"product",
                key: 'id',
            }
        },
    });

    Carts.associate = (models) => {
        Carts.belongsTo(models.user, {
            foreignKey: 'ID',
            as: 'user',
        })
        Carts.belongsTo(models.product, {
            foreignKey: 'ID',
            as: 'product',
        })
    }
    return Carts;
}