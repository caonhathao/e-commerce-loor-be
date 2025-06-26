const {nanoid} = require("nanoid");
module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('reviews', {
        id:{
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            }
        },
        product_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id',
            }
        },
        content: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        timeCreated: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        rating: {
            type: DataTypes.ENUM('1', '2', '3', '4', '5'),
            allowNull: false,
        },

    }, {
        tableName: 'reviews',
        schema: 'store',
        timestamps: true,
        hooks: {
            beforeCreate: (reviews, options) => {
                reviews.id = nanoid(10); // sinh chuỗi mặc định dài 21 ký tự
            }
        }
    });
    Review.associate = (models) => {
        Review.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'users',
        })
        Review.belongsTo(models.Products, {
            foreignKey: 'user_id',
            as: 'products',
        })
    };
    return Review;
}