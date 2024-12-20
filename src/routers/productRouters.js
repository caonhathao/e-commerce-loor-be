// thses are all api for product
const {products, brands} = require('../models');
const _express = require('express');
const {createID} = require("../handle_functions/global_functions");
const router = _express.Router();

//get all product from any vendor
router.get('/api/vendor/get-all-products/:id', async (req, res) => {
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

//post: create new product
router.post('/api/vendor/create-products/:id', async (req, res) => {
    try {
        const product_id = createID(req.body.name);
        const newProduct = await products.create({
            id: product_id,
            category_id: req.body.category_id,
            subCategory_id: req.body.subCategory_id,
            brand_id: req.params.id,
            name: req.body.name,
            origin: req.body.origin,
            price: req.body.price,
            description: req.body.description,
            stock: req.body.stock,
            status: req.body.status,
            promotion: req.body.promotion ?? 0
        });
        if (!newProduct) {
            res.status(404).json({message: 'Create failed! Please check fields again!'});
        }
        
        res.json(newProduct);
    } catch (err) {
        console.error(err);
    }
})

module.exports = router;