const {createID} = require('../utils/functions.global');

const {Carts, ProductVariants, Brands, Products} = require('../models/_index');
const express = require("express");
const router = express.Router();
const statusCode = require('../utils/statusCode');
const multer = require("multer");
const upload = multer();
const {authenticateAccessToken} = require("../security/JWTAuthentication");
const {Sequelize} = require("sequelize");
const {getIO} = require("../services/websocket");
const chalk = require("chalk");

//get: get cart's information (list of products)
router.get('/api/user/get-cart', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else
        try {
            const result = await Carts.findAll({
                where: {
                    user_id: req.user.id,
                },
                attributes: {exclude: ['createdAt', 'updatedAt', 'user_id']},
                include: [{
                    model: ProductVariants,
                    as: 'product_variants',
                    attributes: ['name','price'],
                    include: [{
                        model: Products,
                        as: 'products',
                        attributes: ['status', 'brand_id'],
                        include: [{
                            model: Brands,
                            as: 'brands',
                            attributes: ['name', 'image_link'],
                        }]
                    }]
                }],
                order: [
                    [{model: ProductVariants, as: 'product_variants'},
                        {model: Products, as: 'products'},
                        'brand_id', 'ASC'] // Sắp xếp tăng dần theo brand_id
                ]
            })
            if (!result) {
                return res.status(statusCode.errorHandle).json({message: 'No cart found with this user\'s id'});
            }

            const groupedByBrand = {};

            for (const cart of result) {
                const brand = cart.product_variants?.products?.brands;
                const brandId = cart.product_variants?.products?.brand_id;

                if (!groupedByBrand[brandId]) {
                    groupedByBrand[brandId] = {
                        brand_id: brandId,
                        brand_name: brand?.name || '',
                        brand_image: brand?.image_link || '',
                        items: [],
                    };
                }

                groupedByBrand[brandId].items.push(cart);
            }

            const groupedResult = Object.values(groupedByBrand).map(group => {
                group.items = group.items.map(cart => {
                    const cartJSON = cart.toJSON(); // chuyển instance Sequelize thành object thuần
                    delete cartJSON.product_variants.products.brands; // xoá trường products
                    delete cartJSON.product_variants.products.brand_id;
                    return cartJSON;
                });
                return group;
            });

            return res.status(200).json(groupedResult);
        } catch (err) {
            console.log(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
})

//post: add product (variant) to the customer's cart
router.post('/api/user/add-to-cart', authenticateAccessToken, upload.none(), async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else {
        try {
            for (let i = 0; i < req.body.list.length; i++) {
                const exist = await Carts.findOne({
                    where: {
                        user_id: req.user.id,
                        variant_id: req.body.list[i].id,
                    },
                })
                let newCart;
                if (exist !== 0 && exist) {
                    newCart = await Carts.update({
                        amount: exist.amount + req.body.list[i].amount,
                        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                    }, {
                        where: {
                            user_id: req.user.id,
                            variant_id: req.body.list[i].id,
                        }
                    })
                } else {
                    newCart = await Carts.create({
                        id: createID('CART'),
                        user_id: req.user.id,
                        variant_id: req.body.list[i].id,
                        amount: req.body.list[i].amount,
                        image_link: req.body.list[i].image_link,
                        pinned: false,
                    })
                    if (!newCart) {
                        return res.status(statusCode.errorHandle).json({message: 'Can not add this product to cart'});
                    }
                }
            }
            return res.status(statusCode.success).json({message: 'Added to cart successfully'});
        } catch (err) {
            console.log(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
    }
})

//put: update cart (change amount, pinned status)
router.put('/api/user/update-cart', authenticateAccessToken, upload.none(), async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else {
        try {
            let objectValues = {};
            if (req.body.amount && req.body.amount !== '') {
                objectValues.amount = req.body.amount;
            }
            if (req.body.cost && req.body.cost !== '') {
                objectValues.cost = req.body.cost;
            }
            if (req.body.pinned && req.body.pinned !== '') {
                objectValues.pinned = req.body.pinned;
            }

            const [result] = await Carts.update(objectValues, {
                where: {id: req.body.id}
            })

            if (result === 0) return res.status(statusCode.errorHandle).json({message: 'Update cart failed! Please try again later'});
            return res.status(statusCode.success).json({message: 'Update cart successfully'});
        } catch (err) {
            console.log(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
    }
})

router.delete('/api/user/delete-cart', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else
        try {
            const result = await Carts.destroy({
                where: {
                    id: req.body.id,
                    user_id: req.user.id
                }
            })

            if (result === 0) return res.status(statusCode.errorHandle).json({message: 'Delete cart failed! Please try again later'});
            return res.status(statusCode.success).json({message: 'Delete cart successfully'});
        } catch (err) {
            console.log(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
})
module.exports = router;