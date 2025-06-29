const _express = require('express');
const router = _express.Router();
const {Orders, OrderDetail, NotifyBrand, NotifyUser, ProductVariants} = require('../models/_index');
const {createID} = require("../utils/global_functions");
const statusCode = require("../utils/statusCode");
const express = require("express");
const multer = require("multer");
const upload = multer();
const {authenticateAccessToken} = require("../security/JWTAuthentication");
const {Sequelize} = require("sequelize");
const {getIO} = require("../services/websocket");
const {sendAuthResponse} = require("../utils/authUtils");
const chalk = require("chalk");

//get all notices for vendor
router.get('/api/vendor/get-all-notify-me', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else
        try {
            const result = await NotifyBrand.findAll({
                where: {
                    brand_id: req.user.id,
                },
                attributes: {exclude: ['id', 'brand_id', 'updatedAt']},
            })
            if (!result) {
                return res.status(statusCode.errorHandle).json({message: 'No notify me found with this user\'s id'});
            }
            return res.status(statusCode.success).json(result);
        } catch (err) {
            console.error(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }

})

//accept an order by clicking to notice
router.post('/api/vendor/accept-order', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else
        try {
            const result = await Orders.update({
                status: 'CONFIRMED',
            }, {
                where: {id: req.body.order_id}
            })

            if (!result) return res.status(statusCode.errorHandle).json({message: 'Order is not existed or error'});

            const newNoticeUser = await NotifyUser.create({
                id: createID('NOT-USE'),
                user_id: req.body.user_id,
                content: 'Đơn hàng của bạn đã được xác nhận bởi nhà bán hàng.',
                redirect_url: `/order-detail/${req.body.order_id}`,
                type: "SUCCESS",
            })
            if (!newNoticeUser) return res.status(statusCode.errorHandle).json({message: 'Can not create notice'});
            return res.status(statusCode.success).json({message: 'Order has been confirmed'});

        } catch (err) {
            console.log(chalk.red(err))
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
})

module.exports = router;