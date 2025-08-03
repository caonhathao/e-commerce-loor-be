module.exports = (sequelize, DataTypes) => {
    const ImageReviews = sequelize.define('ImageReviews', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        review_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'reviews',
                key: 'id'
            }
        },
        image_link: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        updatedAt: {
            type: DataTypes.DATE,
        },
    }, {
        tableName: 'image_reviews',
        timestamps: true,
        schema: 'store',
    });

    ImageReviews.associate = (models) => {
        ImageReviews.belongsTo(models.Reviews, {
            foreignKey: 'review_id',
            as: 'Reviews',
        });
    };

    return ImageReviews;
};
