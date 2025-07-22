const _express = require('express');
const router = _express.Router();
const {
    Orders,
    OrderDetail,
    NotifyBrand,
    NotifyUser,
    ProductVariants,
    Receipt,
    Brands
} = require('../models/_index');
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

        console.log(req.body)

        for (const item of req.body.list) {
            counting++;
            const id = createID('ORD');

            //check valid order in every list
            //create a socket to notice about check-in order
            io.to(`room_${req.user.id}`).emit('checking_order', {message: `Checking...${counting}`, step: counting + 1})
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
            io.to(`room_${req.user.id}`).emit('creating_new_order', {
                message: `Creating...${counting}`,
                step: counting + 2
            })

            const newOrder = await Orders.create({
                id: id,
                user_id: req.user.id,
                brand_id: item.brand_id,
                cost: item.cost,
                fee: item.fee || 0,
                status: 'PENDING',
                shipping_type: req.body.shipping_type,
                address: req.body.address,
            })

            if (!newOrder) {
                return res.status(statusCode.errorHandle).json({message: 'Creating order failed'});
            }

            await Receipt.create({
                id: createID('BILL'),
                user_id: req.user.id,
                order_id: id,
                payment: req.body.method,
            })

            //if all orders valid
            //create a socket to notice about storing order
            io.to(`room_${req.user.id}`).emit('storing_order', {message: 'Storing...', step: counting + 3})
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

            await NotifyUser.create({
                id: createID('NOT-USE'),
                user_id: req.user.id,
                title: 'Bạn vừa đặt hàng thành công',
                content: "Đơn hàng của bạn đang chờ nhà bán hàng phê duyệt",
                redirect_url: `/order-detail/${id}`,
                type: "NOTICE",
                status: "IDLE",
            })

            await NotifyBrand.create({
                id: createID('NOT-BRA'),
                brand_id: item.brand_id,
                title: 'Bạn dó đơn hàng mới',
                content: "Bạn có đơn đặt hàng mới",
                redirect_url: `/order-detail/${id}`,
                type: "ORDER",
                status: "IDLE",
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
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20
            const offset = (page - 1) * limit

            const {count, rows} = await Orders.findAndCountAll({
                limit,
                offset,
                where: {
                    user_id: req.user.id,
                },
                attributes: {exclude: ['user_id', 'shipping_type', 'brand_id', 'updatedAt']},
            })
            return res.status(statusCode.success).json({
                current_page: page,
                total_items: count,
                current_items: rows.length,
                total_pages: Math.ceil(count / limit),
                data: rows,
            });
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
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20
            const offset = (page - 1) * limit

            const {count, rows} = await Orders.findAndCountAll({
                limit,
                offset,
                where: {
                    brand_id: req.user.id,
                },
                attributes: {exclude: ['updatedAt', 'fee', 'brand_id']},
            })
            return res.status(statusCode.success).json({
                current_page: page,
                total_items: count,
                current_items: rows.length,
                total_pages: Math.ceil(count / limit),
                data: rows,
            });
        } catch (err) {
            console.error(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
})

router.get('/api/user/get-all-orders-by-status', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR' && req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else
        try {
            const result = await Orders.findAll({
                where: {
                    brand_id: req.user.id,
                    status: req.query.status,
                },
                attributes: {exclude: ['updatedAt', 'fee', 'brand_id']},
            })
            return res.status(statusCode.success).json(result);
        } catch (err) {
            console.error(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
})

router.get('/api/vendor/search-by-id', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20
            const offset = (page - 1) * limit

            const {count, rows} = await Orders.findAndCountAll({
                limit,
                offset,
                where: {
                    id: {
                        [Op.like]: `%${req.query.id}%`
                    }
                },
                attributes: {exclude: ['updatedAt', 'fee', 'brand_id']},
            })
            return res.status(statusCode.success).json({
                current_page: page,
                total_items: count,
                current_items: rows.length,
                total_pages: Math.ceil(count / limit),
                data: rows,
            });
        } catch (e) {
            console.log(chalk.red(e));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
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
router.put('/api/user/cancel-order/:id', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else
        try {
            const result = await Orders.findOne({
                where: {
                    id: req.params.id,
                    user_id: req.user.id,
                }
            })
            if (!result) {
                return res.status(statusCode.errorHandle).json({message: 'No order found with this id'});
            }

            const update = await Orders.update({
                    status: 'CANCELED',
                }, {
                    where: {id: req.params.id}
                }
            )

            await NotifyBrand.create({
                id: createID('NOT-BRA'),
                brand_id: result.brand_id,
                title: 'Đơn hàng bị hủy',
                content: `Đơn hàng có mã ${req.params.id} bị huy`,
                redirect_url: `/order-detail/${req.params.id}`,
                type: "ORDER",
                status: "IDLE",
            })

            await Receipt.update({
                payment_status: 'CANCELED'
            }, {
                where: {
                    order_id: req.params.id
                }
            })
            return res.status(statusCode.success).json({message: 'Deleted successfully'});
        } catch
            (err) {
            console.error(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
})
module.exports = router;