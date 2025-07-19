module.exports = (sequelize, DataTypes) => {
    const NotifyUser = sequelize.define('NotifyUser', {
        id:{
            type:DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'users',
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
        redirect_url:{
          type:DataTypes.STRING
        },
        type: {
            type: DataTypes.ENUM('SUCCESS', 'WARNING', 'ERROR', 'BAN','ADS','NOTICE'),
            defaultValue: 'NOTICE',
            allowNull: false
        },
        status:{
            type:DataTypes.ENUM("READ","IDLE"),
            defaultValue:"IDLE",
            allowNull:false,
        }
    }, {
        tableName: 'notify_user',
        schema: 'store',
        timestamps: true,
    });

    NotifyUser.associate = (models) => {
        NotifyUser.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'users'
        })
    };
    return NotifyUser;
}