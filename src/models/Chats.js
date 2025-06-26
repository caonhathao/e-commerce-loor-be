module.exports=(sequelize,DataTypes) => {
    const ChatSupport = sequelize.define('Chats', {
        user_id:{
            type:DataTypes.STRING,
            allowNull:false,
            references: {
                model:"users",
                key: 'id'
            },
            onDelete: "CASCADE",
        },
        brand_id:{
            type:DataTypes.STRING,
            allowNull:false,
            references: {
                model:"brands",
                key: 'id'
            },
            onDelete: "CASCADE",
        },
        content:{
            type:DataTypes.STRING,
            allowNull:false,
        }
    },{
        tableName: 'chats',
        timestamps: false,
        schema: 'store',
    });
    ChatSupport.associate = function(models) {
        ChatSupport.belongsTo(models.Users,{
            foreignKey:'user_id',
            as : 'users',
        })
        ChatSupport.belongsTo(models.Brands,{
            foreignKey:'brand_id',
            as: 'brands',
        })
    }
    return ChatSupport;
}