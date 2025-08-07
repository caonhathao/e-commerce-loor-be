const {router, statusCode, Provinces, upload, catchAndShowError} = require("../shared/router-dependencies");
router.get('/api/public/get-all-provinces', upload.none(), async (req, res) => {
    try {
        const result = await Provinces.findAll({
            attributes: {exclude: ['createdAt', 'updatedAt', 'type', 'code_gso', 'region']},
        })
        if (!result) {
            return res.status(statusCode.errorHandle).json({message: 'No provinces found'});
        } else {
            return res.status(statusCode.success).json(result);
        }

    } catch (err) {
        catchAndShowError(err, res)
    }
})

module.exports = router;