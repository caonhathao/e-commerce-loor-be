const {router, statusCode, Receipt, catchAndShowError, authenticateAccessToken} = require("../shared/router-dependencies");
router.get('/api/user/get-receipt-from-order/:id', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else try {
        const result = await Receipt.findOne({
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
        catchAndShowError(err, res)
    }
})

module.exports = router;