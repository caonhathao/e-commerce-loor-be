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
            foreignKey:'chats_user_fk',
            as : 'users',
        })
        ChatSupport.belongsTo(models.brands,{
            foreignKey:'chats_brand_fk',
            as: 'brands',
        })
    }
    return ChatSupport;
}