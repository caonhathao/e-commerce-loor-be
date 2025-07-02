const {ProductVariants, Products} = require('../models/_index')
const _express = require('express');
const {Op, Sequelize} = require('sequelize');
const {generateID} = require('../utils/global_functions');
const router = _express.Router();

const {authenticateAccessToken} = require('../security/JWTAuthentication')
const multer = require('multer');
const {uploadToCloudinary, destroyToCloudinary} = require('../controllers/uploadController');
const upload = multer();
const statusCode = require("../utils/statusCode");
const chalk = require("chalk");

//get all product's variants by vendor
router.get('/api/public/get-all-variants/:id', async (req, res) => {
    try {
        delete ProductVariants.rawAttributes.variant_id;
        delete ProductVariants.tableAttributes.variant_id;
        ProductVariants.refreshAttributes();
        const allVariants = await ProductVariants.findAll(
            {
                where: {product_id: req.params.id},
                attributes: {exclude: ['product_id', 'createdAt', 'updatedAt']},
            }
        );

        if (!allVariants) {
            res.status(404).json({message: 'No variant found with this id'});
        } else res.status(202).json(allVariants);

    } catch
        (e) {
        console.error(e);
        res.status(500).json({message: 'Internal server error'});
    }
})

//get any variant's information
router.get('/api/public/get-variant-by-id/:id', async (req, res) => {
    try {
        delete ProductVariants.rawAttributes.variant_id;
        delete ProductVariants.tableAttributes.variant_id;
        ProductVariants.refreshAttributes();
        const variant = await ProductVariants.findOne(
            {
                where: {id: req.params.id}
            }
        )

        if (!variant) {
            res.status(404).json({message: 'No variant found with this id'});
        } else res.status(200).json(variant);
    } catch (e) {
        console.error(e);
        res.status(500).json({message: 'Internal server error'});
    }
})

//create new variants by vendor
router.post('/api/vendor/create-new-variant/:id', authenticateAccessToken, upload.none(), async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        res.status(statusCode.accessDenied).json({message: 'You can not access this action'});
    } else {
        try {
            delete ProductVariants.rawAttributes.variant_id;
            delete ProductVariants.tableAttributes.variant_id;
            ProductVariants.refreshAttributes();
            console.log(Object.keys(ProductVariants.rawAttributes));
            console.log(req.body)

            const newVariant = await ProductVariants.create({
                id: generateID('VARI'),
                product_id: req.params.id,
                sku: req.body.sku,
                price: req.body.price,
                stock: req.body.stock,
                name: req.body.name,
                status: req.body.status,
                has_attribute: false,
            });

            if (!newVariant) {
                res.status(statusCode.errorHandle).json({message: 'Create failed! Please check fields again!'});
            } else {
                const product = await Products.findOne({
                    where: {
                        id: req.params.id
                    }
                });
                if (!product) {
                    return res.status(statusCode.errorHandle).json({message: 'Product not found!'});
                }

                const updatedProduct = await Products.update(
                    {
                        stock: product.stock + Number(req.body.stock),
                        has_attribute: true
                    },
                    {where: {id: req.params.id}}
                );
                if (!updatedProduct) {
                    res.status(statusCode.errorHandle).json({message: 'Create failed! Can not update the total stock of this product'});
                } else res.status(statusCode.success).json({message: 'Created new variant successfully!'});
            }
        } catch (e) {
            console.log(chalk.red(e));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
    }
})

//update variant's information
router.put('/api/vendor/update-variant-with-id/:id', authenticateAccessToken, upload.none(), async (req, res) => {
    console.log(req.body)
    if (req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You can not access this action'});
    } else {
        try {
            const updateFields = {};

            if (req.body.name && req.body.name !== '') {
                updateFields['name'] = req.body.name;
            }
            if (req.body.status && req.body.status !== '') {
                updateFields['status'] = req.body.status;
            }
            if (req.body.sku && req.body.sku !== '') {
                updateFields['sku'] = req.body.sku;
            }
            if (req.body.price && req.body.price !== '') {
                updateFields['price'] = req.body.price;
            }
            if (req.body.stock && req.body.stock !== '') {
                updateFields['stock'] = req.body.stock;
            }
            if (Object.keys(updateFields).length > 0) {
                const update = await ProductVariants.update(updateFields, {
                    where: {
                        id: req.params.id
                    }
                });

                if (update[0] === 0) {
                    return res.status(statusCode.errorHandle).json({message: 'Update failed'});
                } else return res.status(statusCode.success).json({message: 'Update variant successfully!'});
            }

            return res.status(statusCode.success).json({message: 'Update variant successfully!'});
        } catch (err) {
            console.log(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
    }
})
router.delete('/api/vendor/delete-variant-with-id', authenticateAccessToken, upload.none(), async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        res.status(statusCode.accessDenied).json({message: 'You can not access this action'});
    } else {
        try {
            const result = ProductVariants.destroy({
                where: {
                    id: req.body.id
                }
            })
            if (result === 0) {
                res.status(statusCode.errorHandle).json({message: 'Delete failed'});
            } else {
                res.status(statusCode.success).json({message: 'Delete variant successfully!'});
            }

        } catch (err) {
            console.log(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
    }
})
module.exports = router;