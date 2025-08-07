const {
    authenticateAccessToken,
    router,
    statusCode,
    catchAndShowError,
    OrderStatus,
    upload
} = require("../shared/router-dependencies");
const {createID} = require("../utils/functions.global");

router.get('/api/manager/get-order-status', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else {
        try {
            const result = await OrderStatus.findAll({
                attributes: {exclude: ['createdAt', 'updatedAt']},
            })
            if (!result) {
                return res.status(statusCode.errorHandle).json({message: 'No order status found'});
            }
            return res.status(statusCode.success).json(result);
        } catch (err) {
            catchAndShowError(err, res)
        }
    }
})

router.get('/api/user/get-all-order-status', authenticateAccessToken, async (req, res) => {
    try {
        const result = await OrderStatus.findAll(
            {
                attributes: {exclude: ['authority','priority_order','createdAt', 'updatedAt']},
                order: [['priority_order', 'ASC']]
            })
        if (!result) {
            return res.status(statusCode.success).json([]);
        }
        return res.status(statusCode.success).json(result);
    } catch (err) {
        catchAndShowError(err, res)
    }
})

router.get('/api/user/get-order-status-action', authenticateAccessToken, async (req, res) => {
    try {
        const result = await OrderStatus.findAll({
            where: {
                authority: "ROLE_USER"
            },
            attributes: {exclude: ['authority', 'priority_order', 'createdAt', 'updatedAt']},
        })
        if (!result) {
            return res.status(statusCode.success).json([]);
        }
        return res.status(statusCode.success).json(result);
    } catch (err) {
        catchAndShowError(err, res)
    }
})

router.get('api/vendor/get-order-status-action', authenticateAccessToken, async (req, res) => {
    try {
        const result = await OrderStatus.findAll({
            where: {
                authority: "ROLE_VENDOR"
            },
            attributes: {exclude: ['authority', 'priority_order', 'createdAt', 'updatedAt']},
        })
        if (!result) {
            return res.status(statusCode.success).json([]);
        }
        return res.status(statusCode.success).json(result);
    } catch (err) {
        catchAndShowError(err, res)
    }
})

router.post('/api/user/create-order-status', authenticateAccessToken, upload.none(), async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else {
        try {
            const newOrderStatus = await OrderStatus.create({
                id: createID('ORDER-STAT'),
                status_code: req.body.status_code,
                status_name: req.body.status_name,
                status_mean: req.body.status_mean,
                status_color: req.body.status_color,
                authority: req.body.authority,
                priority_order: req.body.priority_order,
            })

            if (!newOrderStatus) {
                return res.status(statusCode.errorHandle).json({message: 'Tạo thất bại'});
            }
            return res.status(statusCode.success).json({message: "Tạo thành công!"});

        } catch (err) {
            catchAndShowError(err, res)
        }
    }
})

module.exports = router;