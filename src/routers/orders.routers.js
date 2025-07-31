const _express = require('express');
const router = _express.Router();
const {
    Orders,
    OrderDetail,
    NotifyBrand,
    NotifyUser,
    Products,
    ProductVariants,
    Receipt,
    Brands
} = require('../models/_index');
const {createID, formatTemplate, catchAndShowError} = require("../utils/functions.global");
const statusCode = require("../utils/statusCode");
const express = require("express");
const multer = require("multer");
const upload = multer();
const {authenticateAccessToken} = require("../security/JWTAuthentication");
const {Sequelize, Op, literal} = require("sequelize");
const {getIO} = require("../services/websocket");
const {sendAuthResponse} = require("../utils/auth.utils");
const chalk = require("chalk");
const systemNotify = require('../utils/system-notify.utils')

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
                io.to(`room_${req.user.id}`).emit('checking_order', {
                    message: `Checking...${counting}`,
                    step: counting + 1
                })
                for (const child of item.list) {
                    delete ProductVariants.rawAttributes.variant_id;
                    delete ProductVariants.tableAttributes.variant_id;
                    ProductVariants.refreshAttributes();

                    //check variant's exist
                    const variant = await ProductVariants.findOne({
                        where: {
                            id: child.variant_id
                        }
                    })

                    if (!variant) {
                        return res.status(statusCode.errorHandle).json({message: "Sản phẩn không tồn tại"})
                    }

                    const checkProduct = await Products.findOne({
                        where: {
                            id: variant.product_id
                        }
                    })

                    if (!checkProduct) {
                        return res.status(statusCode.errorHandle).json({message: "Sản phẩm không tồn tại"})
                    }

                    if (checkProduct.status === "CLOSED") {
                        return res.status(statusCode.errorHandle).json({message: "Sản phẩm đã ngừng kinh doanh"})
                    }

                    if (variant.stock < child.amount) {
                        return res.status(statusCode.errorHandle).json({message: "Sản phẩn hết hàng"});
                    }

                    if (variant.stock - child.amount > 0) {
                        const updateVariant = await ProductVariants.update({
                            stock: literal(`stock - ${child.amount}`)
                        }, {
                            where: {
                                id: child.variant_id
                            }
                        })

                        console.log(chalk.green(updateVariant))
                    } else {
                        const updateVariant = await ProductVariants.update({
                            stock: 0,
                            status: "OUT_OF_STOCK"
                        }, {
                            where: {
                                id: child.variant_id
                            }
                        })
                        console.log(chalk.green(updateVariant))
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

                console.log('New order:', newOrder)

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
                    const result = await OrderDetail.create({
                        id: createID('ORD-DET'),
                        order_id: id,
                        variant_id: child.variant_id,
                        amount: child.amount,
                        cost: child.cost,
                    })

                    if (!result) {
                        return res.status(statusCode.errorHandle).json({message: 'Can not create order detail'});
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

                io.to(`room_${item.brand_id}`).emit('new_order', {
                    message: `Bạn có đơn dặt hàng mới`,
                });
            }
            return res.status(statusCode.success).json({message: 'Created successfully'});
        } catch (err) {
            catchAndShowError(err, res)
        }
    }
)

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
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const offset = (page - 1) * limit;
            if (req.user.role === 'ROLE_USER') {
                const {count, rows} = await Orders.findAndCountAll({
                    limit,
                    offset,
                    where: {
                        user_id: req.user.id,
                        status: req.query.status,
                    },
                    attributes: {exclude: ['updatedAt', 'fee', 'brand_id', 'user_id']},
                })
                return res.status(statusCode.success).json({
                    current_page: page,
                    total_items: count,
                    current_items: rows.length,
                    total_pages: Math.ceil(count / limit),
                    data: rows,
                });
            } else if (req.user.role === 'ROLE_VENDOR') {
                const {count, rows} = await Orders.findAndCountAll({
                    where: {
                        brand_id: req.user.id,
                        status: req.query.status,
                    },
                    attributes: {exclude: ['updatedAt', 'fee', 'brand_id', 'user_id']},
                })

                return res.status(statusCode.success).json({
                    current_page: page,
                    total_items: count,
                    current_items: rows.length,
                    total_pages: Math.ceil(count / limit),
                    data: rows,
                });
            }
        } catch (err) {
            catchAndShowError(err, res)
        }
})

router.get('/api/vendor/search-by-id', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else {
        try {
            console.log(req.query.keyword)
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20
            const offset = (page - 1) * limit

            const {count, rows} = await Orders.findAndCountAll({
                limit,
                offset,
                where: {
                    id: {
                        [Op.like]: `%${req.query.keyword}%`
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

// search orders by id
router.get('/api/user/search-by-id', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'Quyền truy cứu bị từ chối'});
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
                        [Op.like]: `%${req.query.keyword}%`
                    }
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
        } catch (e) {
            catchAndShowError(e, res)
        }
    }
})

//put: update status order
router.put('/api/vendor/update-status-order', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else
        try {
            const io = getIO();

            const check = await Orders.findOne({
                where: {
                    id: req.body.id,
                    brand_id: req.user.id,
                }
            })

            if (!check) {
                return res.status(statusCode.errorHandle).json({message: 'Đơn hàng không tồn tại!'});
            }

            const result = await Orders.update({
                    status: req.body.status,
                }, {
                    where: {id: req.body.id}
                }
            )
            if (result === 0 || !result) {
                return res.status(statusCode.errorHandle).json({message: 'Cập nhật thất bại'});
            }

            const newNotify = await NotifyUser.create({
                id: createID('NOT-USE'),
                user_id: check.user_id,
                title: systemNotify[req.body.status].user_content.title,
                content: formatTemplate(systemNotify[req.body.status].user_content.content, {id: req.body.id}),
                redirect_url: `/order-detail/${req.body.id}`,
                type: systemNotify[req.body.status].type,
                status: "IDLE",
            })

            io.to(`room_${req.user.id}`).emit('creating_new_order', {
                message: `/order-detail/${req.body.id}`,
            })

            return res.status(statusCode.success).json({message: 'Updated successfully'});

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