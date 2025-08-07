const {upload, Districts, statusCode, catchAndShowError, router} = require("../shared/router-dependencies");
router.get('/api/public/get-all-districts/:province_id', upload.none(), async (req, res) => {
    try {
        const result = await Districts.findAll({
            where: {
                province_id: req.params.province_id
            },
            attributes: {exclude: ['createdAt', 'updatedAt', 'province_id', 'code_sgo']},
        })

        if (!result && result === 0) {
            return res.status(statusCode.errorHandle).json({message: 'No districts found'});
        } else {
            return res.status(statusCode.success).json(result);
        }

    } catch (err) {
        catchAndShowError(err, res)
    }
})

module.exports = router;