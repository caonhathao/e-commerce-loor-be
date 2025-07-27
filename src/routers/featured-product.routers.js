const _express = require('express');
const router = _express.Router();
const {FeaturedProduct, Product} = require('../models/_index');
const {createID} = require("../utils/functions.global");
const statusCode = require("../utils/statusCode");
const express = require("express");
const multer = require("multer");
const upload = multer();
const {authenticateAccessToken} = require("../security/JWTAuthentication");
const {Sequelize} = require("sequelize");
const {getIO} = require("../services/websocket");
const {sendAuthResponse} = require("../utils/auth.utils");
const chalk = require("chalk");

router.get('/api/public/get-featured-product', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = req.query.page;
        const offset = (page - 1) * limit;

        const sortBy = req.query.sortBy === 'wishlist' ? 'product_wishlist' : 'product_views';

        const {count, rows} = await FeaturedProduct.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [[sortBy, 'DESC']],
            attributes: {exclude: ['createdAt', 'updatedAt']},
            includes: [{
                model: Product,
                as: 'products',

            }]
        })
        if (rows === 0) {
            return res.status(statusCode.errorHandle).json({message: 'No featured product found'});
        } else {
            return res.status(statusCode.success).json({
                current_page: page,
                total_items: count,
                current_items: rows.length,
                total_pages: Math.ceil(count / limit),
                data: rows,
            });
        }
    } catch (err) {
        console.log(chalk.red(err));
        return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
    }
})

router.post('/api/public/access-product', async (req, res) => {
    console.log(req.query.id)
    try {
        const product_id = req.query.id;

        const record = await FeaturedProduct.findOne({
            where: {
                product_id: product_id
            }
        })
        if (!record) {
            return res.status(statusCode.errorHandle).json({message: 'Can not access this product'});
        }else console.log(record)

        const result = await FeaturedProduct.update(
            {
                product_views: record.product_views + 1
            },
            {
                where: {
                    product_id: product_id
                }
            }
        );


        if (!result) {
            return res.status(statusCode.errorHandle).json({message: 'Can not access this product'});
        }
        return res.status(statusCode.success).json({message: 'Access this product successfully'});

    } catch (err) {
        console.log(chalk.red(err));
        return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
    }
})

module.exports = router;