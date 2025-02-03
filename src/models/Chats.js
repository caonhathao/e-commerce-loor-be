module.exports=(sequelize,DataTypes) => {
    const ChatSupport = sequelize.define('Chats', {
        user_id:{
            type:DataTypes.STRING,
            allowNull:false,
            references: {
                model:"users",
                key: 'ID'
            },
            onDelete: "CASCADE",
        },
        brand_id:{
            type:DataTypes.STRING,
            allowNull:false,
            references: {
                model:"brands",
                key: 'ID'
            },
            onDelete: "CASCADE",
        },
        content:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        createdAt: {
            type: DataTypes.TIME,
            allowNull:false,
        }
    },{
        tableName: 'chats',
    });
    ChatSupport.associate = function(models) {
        ChatSupport.belongsTo(models.users,{
            foreignKey:'user_id',
            as : 'users',
        })
        ChatSupport.belongsTo(models.brands,{
            foreignKey:'brand_id',
            as: 'brands',
        })
    }
    return ChatSupport;
}