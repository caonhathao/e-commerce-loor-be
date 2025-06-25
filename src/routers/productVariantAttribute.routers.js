const {ProductAttributes} = require('../models/_index');

const _express = require('express');
const {authenticateAccessToken} = require("../security/JWTAuthentication");
const chalk = require("chalk");
const {generateID} = require("../utils/global_functions");
const router = _express.Router();

//get all variant's attributes from any variant
router.get('/api/get-all-variant-attributes/:id', async (req, res) => {
    try {
        const allAttributes = await ProductAttributes.findAll(
            {
                where: {variant_id: req.params.id},
                attributes: {exclude: ['id', 'variant_id', 'createdAt', 'updatedAt']},
            }
        );
        if (!allAttributes) {
            res.status(404).json({message: 'No attributes found with this id'});
        }
        res.status(200).json(allAttributes);
    } catch (err) {
        console.error(chalk.red(err));
        res.status(500).json({message: 'Internal server error'});
    }
})


//create new attributes for variant
router.post('/api/vendor/create-new-variant-attribute/:id', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        return res.status(403).json({message: 'You are not allowed to access this action'});
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
                    nameAtt: key,
                    valueAtt: value,
                });
                if (!newProductAttribute) {
                    return res.status(400).json({message: 'Created failed'});
                }
            }

            res.status(200).json({message: 'Created successfully'});
        } catch (e) {
            console.error(chalk.red(e));
        }
    }
})
module.exports = router;