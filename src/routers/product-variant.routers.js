const {ProductVariants, Products, ImageProducts} = require('../models/_index')
const _express = require('express');
const {Op, Sequelize} = require('sequelize');
const {generateID, catchAndShowError, getPublicIdFromURL} = require('../utils/functions.global');
const router = _express.Router();

const {authenticateAccessToken} = require('../security/JWTAuthentication')
const multer = require('multer');
const {uploadToCloudinary, destroyToCloudinary} = require('../controllers/uploadController');
const upload = multer();
const statusCode = require("../utils/statusCode");
const chalk = require("chalk");
const {errorHandle} = require("../utils/statusCode");

//a user gets a variant list from any product
router.get('/api/public/get-all-variants', async (req, res) => {
    try {
        delete ProductVariants.rawAttributes.variant_id;
        delete ProductVariants.tableAttributes.variant_id;
        ProductVariants.refreshAttributes();

        const allVariants = await ProductVariants.findAll(
            {
                where: {product_id: req.query.id},
                attributes: {exclude: ['product_id', 'createdAt', 'updatedAt']},
            }
        );

        if (!allVariants) {
            return res.status(statusCode.errorHandle).json({message: 'No variants found with this id'});
        }
        return res.status(statusCode.success).json(allVariants);
    } catch (e) {
        catchAndShowError(e, res)
    }
})

//user gets any variant's information
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
            return res.status(statusCode.errorHandle).json({message: 'No variant found with this id'});
        } else
            return res.status(statusCode.success).json(variant);
    } catch (e) {
        console.log(chalk.red(e));
        return res.status(statusCode.serverError).json({message: 'Internal server error'});
    }
})

//a vendor gets a variant list from any product
router.get('/api/vendor/get-all-variants', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        res.status(statusCode.accessDenied).json({message: 'You can not access this action'});
    } else {
        try {
            const result = await ProductVariants.findAll({
                where: {
                    product_id: req.query.id,
                },
                attributes: ['id', 'sku', 'name', 'has_attribute']
            })

            return res.status(statusCode.success).json(result);
        } catch (e) {
            catchAndShowError(e, res)
        }
    }
})

//vendor creates new variants
router.post('/api/vendor/create-new-variant/:id', authenticateAccessToken, upload.array('images', 1), async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You can not access this action'});
    } else {
        try {
            delete ProductVariants.rawAttributes.variant_id;
            delete ProductVariants.tableAttributes.variant_id;
            ProductVariants.refreshAttributes();

            if (req.files.length === 0 || !req.files) {
                return res.status(statusCode.missingModule).json({message: 'Thiếu hình ảnh sản phẩm'});
            }

            const imageUrl = await uploadToCloudinary(req.files, process.env.CLOUD_ASSET_F_VARIANT)

            if (!imageUrl) {
                return res.status(statusCode.errorHandle).json({message: 'Tải ảnh thất bại!'});
            }

            const newVariant = await ProductVariants.create({
                id: generateID('VARI'),
                product_id: req.params.id,
                sku: req.body.sku,
                price: req.body.price,
                stock: req.body.stock,
                name: req.body.name,
                status: req.body.status,
                has_attribute: false,
                image_link: imageUrl.toString()
            });

            if (!newVariant) {
                return res.status(statusCode.errorHandle).json({message: 'Create failed! Please check fields again!'});
            }
            return res.status(statusCode.success).json({message: 'Created new variant successfully!'});
        } catch (e) {
            console.log(chalk.red(e));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
    }
})

//vendor update variant's information
router.put('/api/vendor/update-variant-with-id/:id', authenticateAccessToken, upload.array('images', 1), async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You can not access this action'});
    } else {

        console.log(req.body);
        console.log(req.files);

        if (req.files.length === 0 || !req.files && req.body.deletedImages.length === 1) {
            return res.status(statusCode.errorHandle).json({message: "Thiếu hình ảnh sản phẩm"})
        }

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
                } else {
                    //after that, update image to ImageProduct table
                    //first, find and delete all publicID in req.body.deletedImage
                    if (req.body.deletedImages && req.body.deletedImages.length > 0) {
                        //if destroy successfully
                        const publicId = getPublicIdFromURL(req.body.deletedImages, 'products');
                        console.log(chalk.green(publicId))
                        const res = await destroyToCloudinary(publicId);
                        if (res.result !== 'ok') {
                            return res.status(statusCode.errorHandle).json({message: 'Remove image failed!'});
                        }
                    }
                }
            }

            //next, upload an image from req.body.images
            const imageUrl = await uploadToCloudinary(req.files, process.env.CLOUD_ASSET_F_VARIANT);

            if (!imageUrl) {
                return res.status(statusCode.errorHandle).json({message: 'Upload image files failed!'});
            } else {
                const imageProduct = await ProductVariants.update({image_link: imageUrl.toString()}, {
                    where: {
                        id: req.params.id
                    }
                });

                if (!imageProduct) {
                    return res.status(statusCode.errorHandle).json({message: 'Upload Image failed! Please try again'});
                }

                return res.status(statusCode.success).json({message: 'Update successful!'});
            }
        } catch (err) {
            catchAndShowError(err, res)
        }
    }
})

//vendor delete variant
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