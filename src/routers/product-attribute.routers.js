const {ProductAttributes, ProductVariants, Products} = require('../models/_index');

const _express = require('express');
const {authenticateAccessToken} = require("../security/JWTAuthentication");
const chalk = require("chalk");
const {generateID, catchAndShowError} = require("../utils/functions.global");
const router = _express.Router();
const statusCode = require("../utils/statusCode");

//get all variant's attributes from any variant
router.post('/api/public/get-all-variant-attributes', async (req, res) => {
    try {
        const allAttributes = await ProductAttributes.findAll(
            {
                where: {variant_id: req.body.id},
                attributes: {exclude: ['id', 'variant_id', 'createdAt', 'updatedAt']},
            }
        );
        if (!allAttributes) {
            return res.status(statusCode.success).json([]);
        }
        return res.status(statusCode.success).json(allAttributes);
    } catch (err) {
        catchAndShowError(err, res)
    }
})


//create new attributes for variant
router.post('/api/vendor/create-new-variant-attribute/:id', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You are not allowed to access this action'});
    } else {
        try {
            const checkValid = await ProductVariants.findOne({
                where: {
                    id: req.params.id
                }
            })

            if (!checkValid) {
                return res.status(statusCode.errorHandle).json({message: 'Can not found this variant'});
            }
            const checkValidVendor = await Products.findOne({
                where: {
                    brand_id: req.user.id,
                    id: checkValid.product_id
                }
            })

            if (!checkValidVendor) {
                return res.status(statusCode.errorHandle).json({message: 'Can not found this product'});
            }

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
                        has_attribute: true
                    }, {
                        where: {id: req.params.id}
                    })

                    if (!updateVariant) return res.status(statusCode.errorHandle).json({message: 'Can not update variant'});
                }
            }

            return res.status(statusCode.success).json({message: 'Created successfully'});
        } catch (err) {
            catchAndShowError(err, res)
        }
    }
})
module.exports = router;