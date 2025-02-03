module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('reviews', {
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        product_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id',
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
        id: false
    });
    Review.associate = (models) => {
        Review.belongsTo(models.users, {
            foreignKey: 'user_id',
            as: 'users',
        })
        Review.belongsTo(models.products, {
            foreignKey: 'user_id',
            as: 'products',
        })
    };
    return Review;
}