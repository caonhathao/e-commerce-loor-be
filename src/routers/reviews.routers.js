const {Reviews, ProductVariants, ImageReviews, Orders, NotifyBrand} = require('../models/_index');
const {Op, Sequelize, col, fn, literal} = require('sequelize');
const {createID, getPublicIdFromURL, generateID, catchAndShowError} = require("../utils/functions.global");
const {authenticateAccessToken} = require("../security/JWTAuthentication");
const multer = require('multer');
const {getIO} = require("../services/websocket");
const {uploadToCloudinary, destroyToCloudinary} = require("../controllers/uploadController");
const chalk = require("chalk");
const statusCode = require("../utils/statusCode");
const upload = multer();
const _express = require('express');
const router = _express.Router();

//create a new review
router.post('/api/user/create-review', authenticateAccessToken, upload.array('images',1), async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else {
        try {
            const checkValidVariant = await ProductVariants.findOne({
                where: {
                    id: req.body.variant_id
                }
            })

            if (!checkValidVariant) {
                return res.status(statusCode.errorHandle).json({message: 'Sản phẩm này không tồn tại!'});
            }

            if (req.files || req.files.length > 0) {
                const newId = createID('REV')
                const createReview = await Reviews.create({
                    id: newId,
                    user_id: req.user.id,
                    product_id: checkValidVariant.product_id,
                    content: req.body.content,
                    rating: req.body.rating,
                    has_image: true
                })

                if (!createReview) {
                    return res.status(statusCode.errorHandle).json({message: 'Tạo đánh giá thất bại!'});
                }

                const imageUrl = await uploadToCloudinary(req.files, process.env.CLOUD_ASSET_F_REVIEW);
                if (!imageUrl) {
                    return res.status(statusCode.errorHandle).json({message: 'Tải ảnh thất bại'})
                } else {
                    const imageReview = imageUrl.map(item => {
                        ImageReviews.create({
                            id: createID('IMG_REV'),
                            review_id: newId,
                            image_link: item.url
                        })
                    })

                    if (!imageReview) {
                        return res.status(statusCode.errorHandle).json({message: 'Tải ảnh thất bại!'})
                    }
                }
                return res.status(statusCode.success).json({message: 'Đánh giá thành công!'});
            }
        } catch (e) {
            catchAndShowError(e, res);
        }
    }
})

//get all review of a product
router.get('/api/public/get-all-review', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        console.log(req.query.id)

        const reviewHasImage = await Reviews.count({
            where: {
                product_id: req.query.id,
                has_image: true
            }
        })

        const ratingCounts = await Reviews.findAll({
            where: {
                product_id: req.query.id
            },
            attributes: [
                'rating',
                [Sequelize.fn('COUNT', Sequelize.col('rating')), 'count']
            ],
            group: ['rating']
        });

        const stars = {'1': 0, '2': 0, '3': 0, '4': 0, '5': 0};
        ratingCounts.forEach(item => {
            stars[item.rating] = parseInt(item.dataValues.count);
        });


        const {count, rows} = await Reviews.findAndCountAll({
            limit,
            offset,
            where: {
                product_id: req.query.id
            },
            attributes: ['content'],
            include: [{
                model: ImageReviews,
                as: 'ImageReviews',
            }]
        })

        return res.status(statusCode.success).json({
            current_page: page,
            total_items: count,
            current_items: rows.length,
            total_pages: Math.ceil(count / limit),
            data: rows,
            review_has_image: reviewHasImage,
            stars: stars
        })
    } catch (e) {
        catchAndShowError(e, res);
    }
})

module.exports = router;