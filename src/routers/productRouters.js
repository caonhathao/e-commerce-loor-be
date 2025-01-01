// thses are all api for product
const {products, brands} = require('../models');
const _express = require('express');
const {Op, Sequelize} = require('sequelize');
const {createID} = require("../utils/global_functions");
const router = _express.Router();
const multer = require('multer');
const upload = multer();

//get all product from any vendor
router.get('/api/get-all-products/:id', async (req, res) => {
    try {
        const vendor = await brands.findOne({where: {id: req.params.id}});

        if (!vendor) {
            res.status(404).json({message: 'No brand found with this id'});
        } else {
            const allProd = await products.findAll(
                {where: {brand_id: req.params.id}}
            );
            if (!allProd) {
                res.status(404).json({message: 'No product found with this id'});
            } else {
                res.status(200).json(allProd);
            }
        }
    } catch (err) {
        console.error(err);
    }
});

//get info from any product
router.get('/api/get-product-by-id/:id', async (req, res) => {
    try {
        const product = await products.findOne({where: {id: req.params.id}});
        if (!product) {
            res.status(404).json({message: 'No product found with this id'});
        } else res.status(200).json(product);
    } catch (err) {
        console.error(err);
    }
})

//get products by price in range
router.get('/api/get-product-by-price/:p1/:p2', async (req, res) => {
    try {
        console.log(req.params.p1);
        const result = await products.findAll({
            where: {
                price: {
                    [Op.between]: [parseInt(req.params.p1), parseInt(req.params.p2)]
                }
            }
        });
        if (!result) {
            res.status(404).json({message: 'No product found in range'});
        } else res.status(200).json(result);
    } catch (err) {
        console.error(err);
    }
});

//get products by keyword
router.get('/api/get-product-by-key/:k', async (req, res) => {
    try {
        const key = req.params.k.toLowerCase();
        const results = await products.findAll({
            where: Sequelize.literal(`pro_tsv @@ plainto_tsquery('vn_unaccent', '${key}')`),
        });

        if (!results) res.status(404).json({message: 'No product found with keyword'});
        else res.status(200).json(results);
    } catch (err) {
        console.error(err);
    }
})

//post: create new product
router.post('/api/vendor/create-products', upload.none(), async (req, res) => {
    try {
        const product_id = createID(req.body.name);
        console.log(product_id)
        const newProduct = await products.create({
            id: product_id,
            category_id: req.body.category_id,
            subcategory_id: req.body.subCategory_id,
            brand_id: req.body.brand_id,
            name: req.body.name,
            origin: req.body.origin,
            price: req.body.price,
            description: req.body.description,
            stock: req.body.stock,
            status: req.body.status ?? 1,
            promotion: req.body.promotion ?? 0
        });
        if (!newProduct) {
            res.status(404).json({message: 'Create failed! Please check fields again!'});
        }
        res.status(200).json({message: 'Product created!'});
    } catch (err) {
        console.error(err);
    }
})

//post: hide/un-hide product
router.post('/api/vendor/disabled-products/:status/:id', async (req, res) => {
    try {
        const product = await products.update(
            {status: req.params.status},
            {
                where: {id: req.params.id}
            }
        );
        if (!product) {
            res.status(404).json({message: 'No product found with this id'});
        } else {
            res.status(200).json('Successfully disabled product');
        }
    } catch (err) {
        console.error(err);
    }
})

//post: update product
router.post('/api/vendor/update-product/:id', upload.none(), async (req, res) => {
        try {
            const product = await products.findOne({
                where: {
                    id: req.params.id
                }
            });

            if (!product) {
                return res.status(404).json({message: 'Product not found!'});
            }

            const updateFields = {};

            if (req.body.category_id && req.body.category_id !== '') {
                updateFields.category_id = req.body.category_id;
            }
            if (req.body.subCategory_id && req.body.subCategory_id !== '') {
                updateFields.subCategory_id = req.body.subCategory_id;
            }
            if (req.body.name && req.body.name !== '') {
                updateFields.name = req.body.name;
            }
            if (req.body.origin && req.body.origin !== '') {
                updateFields.origin = req.body.origin;
            }
            if (req.body.price && req.body.price !== '') {
                updateFields.price = req.body.price;
            }
            if (req.body.description && req.body.description !== '') {
                updateFields.description = req.body.description;
            }
            if (req.body.stock && req.body.stock !== '') {
                updateFields.stock = req.body.stock;
            }
            if (req.body.status && req.body.status !== '') {
                updateFields.status = req.body.status;
            }
            if (req.body.promotion && req.body.promotion !== '') {
                updateFields.promotion = req.body.promotion;
            }

            console.log(req.body);

            if (Object.keys(updateFields).length > 0) {
                const update = await products.update(updateFields, {
                    where: {
                        id: req.params.id
                    }
                });

                if (!update[0]) {
                    res.status(404).json({message: 'Update failed! Please check fields again!'});
                } else {
                    res.status(200).json({message: 'Update successful!'});
                }
            } else {
                res.status(200).json({message: 'No changes detected!'});
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        }
    }
)

module.exports = router;