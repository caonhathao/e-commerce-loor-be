const _express = require('express');
const router = _express.Router();
const {
    Receipt,
} = require('../models/_index');
const statusCode = require("../utils/statusCode");
const express = require("express");
const multer = require("multer");
const upload = multer();
const {authenticateAccessToken} = require("../security/JWTAuthentication");
const {Sequelize, Op} = require("sequelize");
const {getIO} = require("../services/websocket");
const chalk = require("chalk");

router.get('/api/user/get-receipt-from-order/:id', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else try {
        const result = await Receipt.findAll({
            where: {
                user_id: req.user.id,
            },
            attributes: {exclude: ['user_id', 'updatedAt']}
        })
        if (!result) {
            return res.status(statusCode.errorHandle).json({message: 'No receipt found'});
        }
        return res.status(statusCode.success).json(result);
    } catch (err) {
        console.log(chalk.red(err))
        return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
    }
})

module.exports = router;