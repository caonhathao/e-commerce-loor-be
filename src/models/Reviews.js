module.exports = (sequelize, DataTypes) => {
    const Reviews = sequelize.define('Reviews', {
        id: {
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
            allowNull: false,
        },
        has_image: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        rating: {
            type: DataTypes.ENUM('1', '2', '3', '4', '5'),
            allowNull: false,
        },

    }, {
        tableName: 'reviews',
        schema: 'store',
        timestamps: true,
    });
    Reviews.associate = (models) => {
        Reviews.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'Users',
        })
        Reviews.belongsTo(models.Products, {
            foreignKey: 'user_id',
            as: 'Products',
        })
        Reviews.hasMany(models.ImageReviews, {
            foreignKey: 'review_id',
            as: 'ImageReviews',
        })
    };
    return Reviews;
}