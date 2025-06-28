const _express = require('express');
const router = _express.Router();
const {Orders, OrderDetail, NotifyBrand, ProductVariants} = require('../models/_index');
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

module.exports = router;