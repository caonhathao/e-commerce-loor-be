const _express = require('express');
const router = _express.Router();
const {Orders, OrderDetail, NotifyBrand, NotifyUser, ProductVariants} = require('../models/_index');
const {createID, catchAndShowError} = require("../utils/functions.global");
const statusCode = require("../utils/statusCode");
const express = require("express");
const multer = require("multer");
const upload = multer();
const {authenticateAccessToken} = require("../security/JWTAuthentication");
const {Op} = require("sequelize");
const chalk = require("chalk");

//get all notices for the vendor
router.get('/api/vendor/get-all-notify-me', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20
            const offset = (page - 1) * limit

            const {count, rows} = await NotifyBrand.findAndCountAll({
                limit,
                offset,
                where: {
                    brand_id: req.user.id,
                },
                attributes: {exclude: ['brand_id', 'updatedAt']},
            })
            if (!rows || rows.length === 0) {
                return res.status(statusCode.errorHandle).json({message: 'No notify me found with this user\'s id'});
            }
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

//get all notices for the user
router.get('/api/user/get-all-notify-me', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10
            const offset = (page - 1) * limit

            const {count, rows} = await NotifyUser.findAndCountAll({
                limit,
                offset,
                where: {
                    user_id: req.user.id,
                },
                attributes: {exclude: ['user_id', 'content', 'updatedAt']},
                order: [['createdAt', 'DESC']],
            })

            if (!rows || count === 0) {
                return res.status(statusCode.empty).json({message: 'Không có dữ liệu'});
            }
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

//get notify's detail
router.get('/api/user/get-notify-detail', authenticateAccessToken, async (req, res) => {
    console.log(req.query.id)
    if (req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else {
        try {
            const result = await NotifyUser.findOne({
                where: {
                    id: req.query.id,
                    user_id: req.user.id,
                },
                attributes: {exclude: ['id', 'user_id', 'status', 'updatedAt']},
            })
            if (!result) return res.status(statusCode.errorHandle).json({message: 'Can not find this notice'});

            await NotifyUser.update({
                status: 'READ',
            }, {
                where: {
                    id: req.query.id,
                    user_id: req.user.id,
                }
            })

            return res.status(statusCode.success).json(result);
        } catch (err) {
            console.log(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
    }
})

//get all notifications by status
router.post('/api/user/get-all-notify-by-type', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER' && req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20
            const offset = (page - 1) * limit

            if (req.user.role === 'ROLE_USER') {
                const {count, rows} = await NotifyUser.findAndCountAll({
                    limit,
                    offset,
                    where: {
                        user_id: req.user.id,
                        type: {
                            [Op.in]: req.body.type
                        }
                    }
                })

                if (rows && count > 0) {
                    return res.status(statusCode.success).json({
                        current_page: page,
                        total_items: count,
                        current_items: rows.length,
                        total_pages: Math.ceil(count / limit),
                        data: rows,
                    });
                } else return res.status(statusCode.empty).json({message: 'Không có thông báo nào!'});
            }
            if (req.user.role === 'ROLE_VENDOR') {
                const {count, rows} = await NotifyBrand.findAndCountAll({
                    limit,
                    offset,
                    where: {
                        brand_id: req.user.id,
                        type: {
                            [Op.in]: req.body.type
                        }
                    }
                })

                if (rows && count > 0) {
                    return res.status(statusCode.success).json({
                        current_page: page,
                        total_items: count,
                        current_items: rows.length,
                        total_pages: Math.ceil(count / limit),
                        data: rows,
                    });
                } else return res.status(statusCode.errorHandle).json({message: 'No notify me found with this brand\'s id'});
            }

        } catch (e) {
            console.log(chalk.red(e))
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
})

//user or vendor open notification
router.get('/api/user/open-notification', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER' && req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else
        try {
            if (req.user.role === 'ROLE_USER') {
                const [affectedRows, updatedRows] = await NotifyUser.update(
                    {status: 'READ'},
                    {
                        where: {
                            id: req.body.id,
                            user_id: req.user.id
                        },
                        returning: true,
                    }
                );

                if (affectedRows === 0) {
                    return res.status(statusCode.errorHandle).json({message: 'Thông báo này không tồn tại'});
                } else {
                    const updatedNotify = updatedRows[0];
                    return res.json({message: 'Cập nhật thành công', data: updatedNotify});
                }
            } else if (req.user.role === 'ROLE_VENDOR') {
                const [affectedRows, updatedRows] = await NotifyBrand.update(
                    {status: 'READ'},
                    {
                        where: {
                            id: req.body.id,
                            brand_id: req.user.id
                        },
                        returning: true,
                    }
                );

                if (affectedRows === 0) {
                    return res.status(statusCode.errorHandle).json({message: 'Thông báo này không tồn tại'});
                } else {
                    const updatedNotify = updatedRows[0];
                    return res.json({message: 'Cập nhật thành công', data: updatedNotify});
                }
            }
        } catch (err) {
            console.log(chalk.red(err))
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
                title: 'Đơn hàng được chấp nhận',
                content: 'Đơn hàng của bạn đã được xác nhận bởi nhà bán hàng.',
                redirect_url: `/order-detail/${req.body.order_id}`,
                type: "SUCCESS",
                status: "IDLE",
            })
            if (!newNoticeUser) return res.status(statusCode.errorHandle).json({message: 'Can not create notice'});
            return res.status(statusCode.success).json({message: 'Order has been confirmed'});

        } catch (err) {
            console.log(chalk.red(err))
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
})

//mark all notifications are read
router.put('/api/user/mark-all-notifications-read', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER' && req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else
        try {
            if (req.user.role === 'ROLE_USER') {
                await NotifyUser.update(
                    {status: 'READ'},
                    {
                        where: {
                            user_id: req.user.id,
                            status: 'IDLE'
                        }
                    }
                )
            }else if (req.user.role === 'ROLE_VENDOR') {
                await NotifyBrand.update(
                    {status: 'READ'},
                    {
                        where: {
                            brand_id: req.user.id,
                            status: 'IDLE'
                        }
                    }
                )
            }
            return res.status(statusCode.success).json({message: 'Đánh dấu thành công!'});
        } catch (err) {
            catchAndShowError(err, res)
        }
})

//when a user and vendor want to delete their notifications,
// the user/vendor deletes one
router.delete('/api/user/delete-notification', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER' && req.user.role !== 'ROLE_BRAND') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else
        try {
            let result;
            if (req.user.role === 'ROLE_USER') {
                result = await NotifyUser.destroy({
                    where: {
                        id: req.body,
                        user_id: req.user.id,
                    }
                })
            } else if (req.user.role === 'ROLE_BRAND') {
                result = await NotifyBrand.destroy({
                    where: {
                        id: req.params.id,
                        brand_id: req.user.id,
                    }
                })
            }

            if (!result || result === 0) return res.status(statusCode.errorHandle).json({message: 'Xóa thông báo thất bại'})
            return res.status(statusCode.success).json({message: 'Xoá thành công'});
        } catch (err) {
            console.log(chalk.red(err))
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
})

//the user/vendor deletes more (a list)
router.delete('/api/user/delete-notifications', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER' && req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    }
    const ids = req.body; //['id1','id2','...']
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(statusCode.missingModule).json({message: 'No notification IDs provided'});
    }

    try {
        let result;

        if (req.user.role === 'ROLE_USER') {
            result = await NotifyUser.destroy({
                where: {
                    user_id: req.user.id,
                    id: {
                        [Op.in]: ids
                    }
                }
            });
        } else if (req.user.role === 'ROLE_VENDOR') {
            result = await NotifyBrand.destroy({
                where: {
                    brand_id: req.user.id,
                    id: {
                        [Op.in]: ids
                    }
                }
            });
        }
        if (result === 0) return res.status(statusCode.empty).json({message: 'Không có dữ liệu'});
        return res.status(statusCode.success).json({message: 'Deleted successfully'});
    } catch (err) {
        console.log(chalk.red(err));
        return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
    }
});

//the user/vendor deletes all
router.delete('/api/user/delete-all-notifications', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER' && req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    }
    try {
        let result;

        if (req.user.role === 'ROLE_USER') {
            result = await NotifyUser.destroy({
                where: {
                    user_id: req.user.id,
                }
            });
        } else if (req.user.role === 'ROLE_VENDOR') {
            result = await NotifyBrand.destroy({
                where: {
                    brand_id: req.user.id,
                }
            });
        }

        if (!result || result === 0) return res.status(statusCode.errorHandle).json({message: 'Xóa thất bại'})
        return res.status(statusCode.success)
    } catch (err) {
        console.log(chalk.red(err));
        return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
    }
})


module.exports = router;