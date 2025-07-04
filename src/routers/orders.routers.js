const _express = require('express');
const router = _express.Router();
const {Orders, OrderDetail, NotifyBrand, ProductVariants, BillPayment} = require('../models/_index');
const {createID} = require("../utils/functions.global");
const statusCode = require("../utils/statusCode");
const express = require("express");
const multer = require("multer");
const upload = multer();
const {authenticateAccessToken} = require("../security/JWTAuthentication");
const {Sequelize, Op} = require("sequelize");
const {getIO} = require("../services/websocket");
const {sendAuthResponse} = require("../utils/authUtils");
const chalk = require("chalk");

//post: create new order
router.post('/api/user/create-new-order', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else try {
        //approve each order
        let counting = 0;
        const io = getIO();

        for (const item of req.body.list) {
            counting++;
            const id = createID('ORD');

            //check valid order in every list
            //create a socket to notice about check-in order
            io.emit('checking order', {message: `Checking...${counting}`})
            for (const child of item.list) {
                delete ProductVariants.rawAttributes.variant_id;
                delete ProductVariants.tableAttributes.variant_id;
                ProductVariants.refreshAttributes();
                const product = await ProductVariants.findOne({
                    where: {
                        id: child.variant_id
                    }
                })

                //if a system cannot find any product record or stock is not enough
                if (!product || product.stock < child.amount) {
                    return res.status(statusCode.errorHandle).json({message: `Product ${product.name} not found or not enough stock`});
                }

                //if the brand has been blocked
                if (product.status === false) {
                    return res.status(statusCode.errorHandle).json({message: 'Product has been blocked'});
                }
            }

            //if pass,
            //creates a socket to notice about status order
            io.emit('creating new order', {message: `Creating...${counting}`})

            const newOrder = await Orders.create({
                id: id,
                user_id: req.user.id,
                brand_id: item.brand_id,
                cost: item.cost,
                fee: item.fee,
                status: 'PENDING',
            })

            if (!newOrder) {
                return res.status(statusCode.errorHandle).json({message: 'Creating order failed'});
            }

            await BillPayment.create({
                id: createID('BILL'),
                user_id: req.user.id,
                order_id: id,
                payment: req.body.method,
            })

            //if all orders valid
            //create a socket to notice about storing order
            io.emit('storing order', {message: 'Storing...'})
            for (const child of item.list) {
                const product = await OrderDetail.create({
                    id: createID('ORD-DET'),
                    order_id: id,
                    variant_id: child.variant_id,
                    amount: child.amount,
                    cost: child.cost,
                })

                if (!product) {
                    return res.status(statusCode.errorHandle).json({message: 'Can not create order detail'});
                } else if (product.stock < item.amount) {
                    return res.status(statusCode.errorHandle).json({message: 'Not enough stock'});
                }
            }

            await NotifyBrand.create({
                id: createID('NOT-BRA'),
                brand_id: item.brand_id,
                content: "Bạn có đơn đặt hàng mới",
                redirect_url: `/order-detail/${id}`,
                type: "ORDER",
            })
        }
        return res.status(statusCode.success).json({message: 'Created successfully'});

    } catch (err) {
        console.error(chalk.red(err));
        return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
    }
})

//get: get all orders from any customer
router.get('/api/user/get-all-orders', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else
        try {
            const result = await Orders.findAll({
                where: {
                    user_id: req.user.id,
                },
                attributes: {exclude: ['user_id']},
            })
            if (!result) {
                return res.status(statusCode.errorHandle).json({message: 'No order found with this user\'s id'});
            }
            return res.status(statusCode.success).json(result);
        } catch (err) {
            console.error(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
})

router.get('/api/vendor/get-all-orders', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else
        try {
            const result = await Orders.findAll({
                where: {
                    brand_id: req.user.id,
                },
                attributes: {exclude: ['updatedAt', 'fee', 'brand_id']},
            })
            if (!result) {
                return res.status(statusCode.errorHandle).json({message: 'No order found with this user\'s id'});
            }
            return res.status(statusCode.success).json(result);
        } catch (err) {
            console.error(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
})

router.post('/api/vendor/get-all-orders-by-status', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else
        try {
            let ans;
            if (req.body.status === 'PENDING' || req.body.status === 'COMPLETE' || req.body.status === 'CANCELED' || req.body.status === 'CONFIRMED' || req.body.status === 'DELIVERING') {
                ans = await Orders.findAll({
                    where: {
                        brand_id: req.user.id,
                        status: req.body.status,
                    },
                    attributes: {exclude: ['updatedAt', 'fee', 'brand_id']},
                })
            } else if (req.body.status === 'OTHER') {
                ans = await Orders.findAll({
                    where: {
                        brand_id: req.user.id,
                        status: {
                            [Op.notIn]: ['PENDING', 'COMPLETE', 'CANCELED', 'CONFIRMED', 'DELIVERING']
                        },
                    },
                    attributes: {exclude: ['updatedAt', 'fee', 'brand_id']},
                })
            } else {
                ans = await Orders.findAll({
                    where: {
                        brand_id: req.user.id,
                    },
                    attributes: {exclude: ['updatedAt', 'fee', 'brand_id']},
                })
            }
            if (!ans || ans === 0) {
                return res.status(statusCode.errorHandle).json({message: 'No order found with this status'});
            } else return res.status(statusCode.success).json(ans);

        } catch (err) {
            console.error(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
})

//put: update status order
router.put('/api/vendor/update-status-order', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else
        try {
            console.log(req.body)
            const result = await Orders.update({
                    status: req.body.status,
                }, {
                    where: {id: req.body.id}
                }
            )
            if (result === 0 || !result) {
                return res.status(statusCode.errorHandle).json({message: 'No order found with this id'});
            } else return res.status(statusCode.success).json({message: 'Updated successfully'});
        } catch (err) {
            console.error(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
})

//delete: cancel an order
router.delete('/api/user/cancel-order/:id', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else
        try {
            const result = await Orders.destroy({
                where: {
                    id: req.params.id,
                    user_id: req.user.id,
                }
            })
            if (result === 0) {
                return res.status(statusCode.errorHandle).json({message: 'No order found with this id'});
            } else return res.status(statusCode.success).json({message: 'Deleted successfully'});
        } catch (err) {
            console.error(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
})
module.exports = router;