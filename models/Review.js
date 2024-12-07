module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('reviews', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'ID',
            },
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'ID',
            },
            onDelete: "CASCADE",
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
    });
    Review.associate = (models) => {
        Review.belongsTo(models.users, {
            foreignKey: 'review_user_id',
            as: 'users',
        })
        Review.belongsTo(models.products, {
            foreignKey: 'review_product_id',
            as: 'products',
        })
    };
    return Review;
}