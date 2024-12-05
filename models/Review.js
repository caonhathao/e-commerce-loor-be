module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('review', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id',
            },
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'product',
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
    })
    Review.associate = (models) => {
        Review.belongsTo(models.user, {
            foreignKey: 'ID',
            as: 'user',
        })
        Review.belongsTo(models.product, {
            foreignKey: 'ID',
            as: 'product',
        })
    };
    return Review;
}