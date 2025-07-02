const {ProductAttributes, ProductVariants} = require('../models/_index');

const _express = require('express');
const {authenticateAccessToken} = require("../security/JWTAuthentication");
const chalk = require("chalk");
const {generateID} = require("../utils/global_functions");
const router = _express.Router();
const statusCode = require("../utils/statusCode");

//get all variant's attributes from any variant
router.post('/api/public/get-all-variant-attributes', async (req, res) => {
    console.log(req.body)
    try {
        const allAttributes = await ProductAttributes.findAll(
            {
                where: {variant_id: req.body.id},
                attributes: {exclude: ['id', 'variant_id', 'createdAt', 'updatedAt']},
            }
        );
        if (!allAttributes) {
            res.status(404).json({message: 'No attributes found with this id'});
        }
        console.log(allAttributes)
        res.status(200).json(allAttributes);
    } catch (err) {
        console.error(chalk.red(err));
        res.status(statusCode.serverError).json({message: 'Internal server error. Please try again later!'});
    }
})


//create new attributes for variant
router.post('/api/vendor/create-new-variant-attribute/:id', authenticateAccessToken, async (req, res) => {
    console.log(req.body)
    if (req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else {
        try {
            const deleteAtt = await ProductAttributes.destroy({
                where: {
                    variant_id: req.params.id
                }
            });
            for (const [key, value] of Object.entries(req.body)) {
                const newProductAttribute = await ProductAttributes.create({
                    id: generateID('ATTR'),
                    variant_id: req.params.id,
                    name_att: key,
                    value_att: value,
                });
                if (!newProductAttribute) {
                    return res.status(statusCode.errorHandle).json({message: 'Created failed'});
                } else {
                    const updateVariant = await ProductVariants.update({
                        has_attributes: true
                    }, {
                        where: {id: req.params.id}
                    })

                    if (!updateVariant) return res.status(statusCode.errorHandle).json({message: 'Can not update variant'});
                }
            }

            return res.status(statusCode.success).json({message: 'Created successfully'});
        } catch (err) {
            console.error(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Internal server error. Please try again later!'});
        }
    }
})
module.exports = router;