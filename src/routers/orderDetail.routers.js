const _express = require('express');
const router = _express.Router();
const {OrderDetail} = require('../models/_index');
const statusCode = require("../utils/statusCode");
const multer = require("multer");
const {authenticateAccessToken} = require("../security/JWTAuthentication");
const chalk = require("chalk");

//get: get all order from any customer
router.get('/api/user/get-order-detail/:id', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else
        try {
            const result = await OrderDetail.findAll({
                where: {
                    order_id: req.params.id,
                },
                attributes: {exclude: ['id','createdAt','updatedAt']},
            })
            if (!result) {
                return res.status(statusCode.errorHandle).json({message: 'No order detail found with this user\'s id'});
            }
            return res.status(statusCode.success).json(result);
        } catch (err) {
            console.error(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
})

module.exports = router;