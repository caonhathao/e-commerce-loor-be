const _express = require('express');
const router = _express.Router();
const {OrderDetail, Orders, ProductVariants} = require('../models/_index');
const statusCode = require("../utils/statusCode");
const multer = require("multer");
const {authenticateAccessToken} = require("../security/JWTAuthentication");
const chalk = require("chalk");
const {where} = require("sequelize");
const {catchAndShowError} = require("../utils/functions.global");

//get: get all orders from any customer
//get order detail
router.get('/api/user/get-order-detail/:id', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER' && req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else
        try {
            const response = await Orders.findOne({
                include: [
                    {
                        model: OrderDetail,
                        as: 'OrderDetail',
                        attributes: {exclude: ['id', 'order_id', 'createdAt', 'updatedAt']},
                        include: [{
                            model: ProductVariants,
                            as: 'ProductVariants',
                            attributes: ['name', 'sku', 'price']
                        }]
                    },
                ],
                attributes: {exclude: ['updatedAt']},
                where: {
                    id: req.params.id
                }
            })
            if (!response) return res.status(statusCode.errorHandle).json({message: 'Can not found this order detail'})
            return res.status(statusCode.success).json(response);
        } catch (err) {
            catchAndShowError(err, res);
        }
})

module.exports = router;