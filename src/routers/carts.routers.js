const {createID} = require('../utils/functions.global');

const {Carts} = require('../models/_index');
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
                attributes: {exclude: ['createdAt', 'updatedAt']},
            })
            if (!result) {
                return res.status(statusCode.errorHandle).json({message: 'No cart found with this user\'s id'});
            }
            return res.status(statusCode.success).json(result);
        } catch (err) {
            console.log(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
})

//post: add product (variant) to customer's cart
router.post('/api/user/add-to-cart', authenticateAccessToken, upload.none(), async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else {
        try {
            const newCart = await Carts.create({
                id: createID('CART'),
                user_id: req.user.id,
                variant_id: req.body.variant_id,
                amount: req.body.amount,
                image_link: req.body.image_link,
                cost: req.body.cost,
                pinned: req.body.pinned,
            })

            if (!newCart) {
                return res.status(statusCode.errorHandle).json({message: 'Can not add this product to cart'});
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