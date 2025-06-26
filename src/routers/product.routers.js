// theses are all api for product
const {Products, Brands, ImageProduct, ProductVariants} = require('../models/_index');
const _express = require('express');
const {Op, Sequelize} = require('sequelize');
const {createID, getPublicIdFromURL, generateID} = require("../utils/global_functions");
const router = _express.Router();

const {authenticateAccessToken} = require("../security/JWTAuthentication");
const multer = require('multer');
const {getIO} = require("../services/websocket");
const {uploadToCloudinary, destroyToCloudinary} = require("../controllers/uploadController");
const chalk = require("chalk");
const upload = multer();


//get all products
router.get('/api/public/get-all-products', async (req, res) => {
    try {
        const allProd = await Products.findAll({
            attributes: {exclude: ['createdAt', 'description', 'otherVariant', 'pro_tsv', 'stock', 'tags', 'updatedAt']},
            include: [{
                model: ImageProduct, as: "image_products", attributes: {exclude: ['product_id', 'id', 'image_id']},
            }],
        });
        if (!allProd) {
            res.status(404).json({message: 'No product found'});
        } else res.status(200).json(allProd);
    } catch (e) {
        console.log(chalk.red(e))
        res.status(500).json({message: 'Internal server error'});
    }
})

//to get all products from any vendor
router.get('/api/vendor/get-all-products/:id', authenticateAccessToken, async (req, res) => {
    console.log(req.body);
    if (req.user.role !== 'ROLE_VENDOR') {
        res.status(404).json({message: 'You are not authorized to view this page'});
    } else
        try {
            const vendor = await Brands.findOne({where: {id: req.params.id}});

            if (!vendor) {
                res.status(404).json({message: 'No brand found with this id'});
            } else {
                //only get id, category, name, origin, price, stock and status
                const allProd = await Products.findAll(
                    {
                        where: {brand_id: req.params.id},
                        attributes: {exclude: ['pro_tsv', 'brand_id', 'promotion', 'description', 'tags']},
                    }
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
router.get('/api/public/get-product-by-id/:id', async (req, res) => {
    try {
        const product = await Products.findOne({
            where: {id: req.params.id},
            include: [{
                model: ImageProduct, as: "image_products", attributes: {exclude: ['product_id']}
            }],
        });
        if (!product) {
            return res.status(404).json({message: "No product found with this id"});
        }

        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Internal Server Error"});
    }

})

//get Products by price in range
router.get('/api/get-product-by-price/:p1/:p2', async (req, res) => {
    try {
        const result = await Products.findAll({
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

//get Products by keyword
router.get('/api/public/get-product-by-key/:k', async (req, res) => {
    try {
        const key = req.params.k.toLowerCase();
        const results = await Products.findAll({
            where: Sequelize.literal(`pro_tsv @@ plainto_tsquery('vn_unaccent', '${key}')`),
        });

        if (!results) res.status(404).json({message: 'No product found with keyword'});
        else res.status(200).json(results);
    } catch (err) {
        console.error(err);
    }
})

//post: create new product
router.post('/api/vendor/create-products', authenticateAccessToken, upload.array('images', 10), async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        res.status(404).json({message: 'Access token is invalid'});
    } else
        try {
            const tags = req.body.tags !== null || req.body.tags !== '' ? req.body.tags.split(",") : [];

            if (!req.files || req.files.length === 0) {
                res.status(404).json({message: 'Can not found image files!'});
            } else {
                const imageUrl = await uploadToCloudinary(req.files, 'products');

                if (!imageUrl) {
                    res.status(404).json({message: 'Upload image files failed!'});
                } else {
                    const newProduct = await Products.create({
                        id: generateID('PROD'),
                        category_id: req.body.category_id,
                        subcategory_id: req.body.subCategory_id,
                        brand_id: req.user.id,
                        name: req.body.name,
                        origin: req.body.origin,
                        price: req.body.price,
                        description: req.body.description,
                        stock: req.body.stock ?? 0,
                        status: req.body.status ?? 1,
                        tags: tags,
                    });

                    if (!newProduct) {
                        res.status(404).json({message: 'Create failed! Please check fields again!'});
                    } else {
                        const imageProduct = imageUrl.map((item) => {
                            ImageProduct.create({
                                id: createID('IMG'),
                                image_id: getPublicIdFromURL(item, process.env.CLOUD_ASSET_F_P),
                                product_id: newProduct.id,
                                image_link: item,
                            });
                        })

                        if (!imageProduct) {
                            res.status(404).json({message: 'Upload Image failed! Please try again'});
                        } else res.status(200).json({message: 'Product created!'});
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }
})

//put: hide/un-hide product
router.put('/api/vendor/disabled-products/:status/:id', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        res.status(404).json({message: 'Access token is invalid'});
    } else {
        try {
            const product = await Products.update(
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
    }
})

//put: update product
router.put('/api/vendor/update-product/:id', authenticateAccessToken, upload.array('images', 10), async (req, res) => {
        //console.log(chalk.green('Product update info: ' + JSON.stringify(req.body)))
        if (req.user.role !== 'ROLE_VENDOR') {
            res.status(404).json({message: 'Access token is invalid'});
        } else {
            try {
                const product = await Products.findOne({
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
                if (req.body.subcategory_id && req.body.subcategory_id !== '') {
                    updateFields.subcategory_id = req.body.subcategory_id;
                }
                if (req.body.name && req.body.name !== '') {
                    updateFields.name = req.body.name;
                }
                if (req.body.origin && req.body.origin !== '') {
                    updateFields.origin = req.body.origin;
                }
                if (req.body.status && req.body.status !== '') {
                    updateFields.status = req.body.status;
                }
                if (req.body.description && req.body.description !== '') {
                    updateFields.description = req.body.description;
                }
                if (req.body.averagePrice && req.body.averagePrice !== '') {
                    updateFields.averagePrice = req.body.averagePrice;
                }
                if (req.body.promotion && req.body.promotion !== '') {
                    updateFields.promotion = req.body.promotion;
                }
                if (req.body.otherVariant && req.body.otherVariant !== '') {
                    updateFields.otherVariant = req.body.otherVariant;
                }
                if (req.body.tags && req.body.tags !== '') {
                    updateFields.tags = req.body.tags.split(",");
                }

                //update data in product table
                if (Object.keys(updateFields).length > 0) {
                    const update = await Products.update(updateFields, {
                        where: {
                            id: req.params.id
                        }
                    });

                    if (!update[0]) {
                        res.status(404).json({message: 'Update failed! Please check fields again!'});
                    } else {
                        //after that, update image to ImageProduct table
                        //first, find and delete all publicID in req.body.deletedImage
                        if (req.body.deletedImages && req.body.deletedImages.length > 0) {
                            for (const image of JSON.parse(req.body["deletedImages"])) {
                                //if destroy successfully
                                const res = await destroyToCloudinary(image);
                                console.error('error: ', res)
                                //when destroyed, cloudinary will send  a json with content: {'result':'ok}
                                if (res.result === 'ok') {
                                    console.log(`Image with public id: ${image["image_id"]} was deleted by vendor: ${req.user.id}`);
                                    const effectRows = await ImageProduct.destroy({
                                        where: {image_id: image.image_id}
                                    })
                                    if (effectRows > 0) {
                                        console.log('Effect Rows deleted');
                                    } else res.status(404).json({message: 'Effect Rows deleted'});
                                } else console.error(`Image with this public id: ${image["image_id"]} was not deleted!`)
                            }
                        }
                    }


                    //next, upload all image from req.body.images
                    const imageUrl = await uploadToCloudinary(req.files, process.env.CLOUD_ASSET_F_P);

                    if (!imageUrl) {
                        res.status(404).json({message: 'Upload image files failed!'});
                    } else {
                        const imageProduct = imageUrl.map((item) => {
                            ImageProduct.create({
                                id: generateID('IMG'),
                                image_id: getPublicIdFromURL(item, process.env.CLOUD_ASSET_F_P),
                                product_id: req.body.id,
                                image_link: item,
                            });
                        })

                        if (!imageProduct) {
                            res.status(404).json({message: 'Upload Image failed! Please try again'});
                        }

                        res.status(200).json({message: 'Update successful!'});
                    }
                } else {
                    res.status(403).json({message: 'No changes detected!'});
                }
            } catch
                (err) {
                console.error(err);
                res.status(500).json({message: 'Internal server error'});
            }
        }
    }
)

//delete: delete product permanent
router.delete('/api/vendor/delete-product/:id', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        res.status(404).json({message: 'Access token is invalid'});
    } else
        try {
            const result = await Products.destroy({
                where: {id: req.params.id}
            })
            if (!result) {
                res.status(404).json({message: 'No product found with this id'});
            }

            //running websocket event when delete successfully
            const io = getIO();
            io.emit('delete-product', {id: req.params.id});
            res.status(200).json({message: 'Product deleted!'});
        } catch (err) {
            console.error(err);
            return res.status(500).json({message: "Server error"});
        }
})

module.exports = router;