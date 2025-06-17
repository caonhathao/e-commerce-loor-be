const {ProductVariants, Brands, Products} = require('../models/_index')
const _express = require('express');
const {Op, Sequelize} = require('sequelize');
const {generateID} = require('../utils/global_functions');
const router = _express.Router();

const {authenticateToken, authenticateAccessToken} = require('../security/JWTAuthentication')
const multer = require('multer');
const {uploadToCloudinary, destroyToCloudinary} = require('../controllers/uploadController');
const upload = multer();

//get all product's variants by vendor
router.get('/api/get-all-variants/:id', async (req, res) => {
    try {
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
router.get('/api/get-variant-by-id/:id', async (req, res) => {
    try {
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
    console.log(req.body);
    if (req.user.role !== 'ROLE_VENDOR') {
        res.status(404).json({message: 'You are not authorized to view this page'});
    } else {
        try {
            const newVariant = await ProductVariants.create({
                id: generateID('VARI'),
                product_id: req.params.id,
                sku: req.body.sku,
                price: req.body.price,
                stock: req.body.stock,
                name: req.body.name,
                status: req.body.status,
                hasAttribute: false
            });

            if (!newVariant) {
                res.status(404).json({message: 'Create failed! Please check fields again!'});
            } else {
                const product = await Products.findOne({
                    where: {
                        id: req.params.id
                    }
                });
                console.log(product.dataValues.stock);
                if (!product) {
                    return res.status(404).json({message: 'Product not found!'});
                }

                const updatedProduct = await Products.update(
                    {stock: product.stock + req.body.stock},
                    {where: {id: req.params.id}}
                );
                console.log(updatedProduct);
                if (!updatedProduct) {
                    res.status(404).json({message: 'Create failed! Can not update the total stock of this product'});
                } else res.status(202).json({message: 'Created new variant successfully!'});
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({message: 'Internal server error'});
        }
    }
})

//update variant's information
router.put('/api/vendor/update-variant-with-id/:variantId', authenticateToken, upload.none(), async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        res.status(404).json({message: 'You are not authorized to view this page'});
    } else {
        try {
            const updateFields = {};

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
                        id: req.params.variantId
                    }
                });

                if (update[0] === 0) {
                    res.status(404).json({message: 'Update failed'});
                } else res.status(200).json({message: 'Update variant successfully!'});
            }

        } catch (e) {
            console.error(e);
            res.status(500).json({message: 'Internal server error'});
        }
    }
})

module.exports = router;