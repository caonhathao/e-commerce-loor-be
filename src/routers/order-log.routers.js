const {
    router,
    authenticateAccessToken,
    OrderLog,
    statusCode,
    catchAndShowError
} = require('../shared/router-dependencies')

router.get('/user/order-log', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        return res.status(403).json({message: 'You are not allowed to access this action'})
    } else {
        try {
            const result = await OrderLog.findAll({
                where: {
                    order_id: req.query.order_id,
                },
                attributes: {exclude: ['order_id', 'id', 'updatedAt']}
            })
            if (!result) {
                return res.status(statusCode.success).json([])
            }
            return res.status(statusCode.success).json(result)
        } catch (err) {
            catchAndShowError(err, res)
        }
    }
})

router.delete('/user/remove-order-log', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        return res.status(403).json({message: 'You are not allowed to access this action'})
    } else {
        try {
            const result = await OrderLog.destroy({
                where: {
                    order_id: req.query.order_id,
                }
            })

            if (!result) {
                return res.status(statusCode.errorHandle).json({message: 'Can not remove order log'})
            }
            return res.status(statusCode.success).json({message: 'Remove order log successfully'})
        } catch (err) {
            catchAndShowError(err, res)
        }
    }
})

module.exports = router