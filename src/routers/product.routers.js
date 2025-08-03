const {Products, ImageProducts, ProductVariants, ProductAttributes, FeaturedProduct} = require('../models/_index');
const {Op, Sequelize, col, fn, literal} = require('sequelize');
const {createID, getPublicIdFromURL, generateID, catchAndShowError} = require("../utils/functions.global");
const {authenticateAccessToken} = require("../security/JWTAuthentication");
const multer = require('multer');
const {getIO} = require("../services/websocket");
const {uploadToCloudinary, destroyToCloudinary} = require("../controllers/uploadController");
const chalk = require("chalk");
const statusCode = require("../utils/statusCode");
const upload = multer();
const _express = require('express');
const router = _express.Router();

//get all products
router.get('/api/public/get-all-products', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20
        const offset = (page - 1) * limit

        const count = await Products.count({
            where: {status: "OPENED"}
        });

        const {fn, col} = require("sequelize");

        const rows = await Products.findAll({
            limit,
            offset,
            where: {status: "OPENED"},
            attributes: {
                exclude: ['createdAt', 'description', 'otherVariant', 'pro_tsv', 'stock', 'tags', 'updatedAt'],
            },
            include: [
                {
                    model: ImageProducts,
                    as: "ImageProducts",
                    attributes: {exclude: ['product_id', 'id', 'image_id']}
                },
                {
                    model: ProductVariants,
                    as: "ProductVariants",
                    attributes: [], // chỉ cần JOIN để SUM
                    required: false
                }
            ],
        });

        return res.status(statusCode.success).json({
            current_page: page,
            total_items: count,
            current_items: rows.length,
            total_pages: Math.ceil(count / limit),
            data: rows,
        });
    } catch (e) {
        catchAndShowError(e, res);
    }
})

//to get all products from a brand by user
router.get('/api/public/get-all-products/:id', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20
        const offset = (page - 1) * limit

        const count = await Products.count({
            where: {brand_id: req.params.id},
        });

        const rows = await Products.findAll({
            limit,
            offset,
            where: {
                brand_id: req.params.id,
                status: "OPENED"
            },
            include: [{
                model: ImageProduct,
                as: "image_products",
                required: false,
                attributes: {exclude: ['product_id']}
            }],
            attributes: {exclude: ['pro_tsv', 'brand_id', 'promotion', 'description', 'tags']},
            order: [['status', 'ASC']]
        });
        console.log(count, rows.length);
        return res.status(statusCode.success).json({
            current_page: page,
            total_items: count,
            current_items: rows.length,
            total_pages: Math.ceil(count / limit),
            data: rows,
        });
    } catch (err) {
        console.log(chalk.red(err));
        return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
    }
})

//get all products by category/subcategory and options
router.get('/api/public/get-all-products-by-filter', async (req, res) => {
    try {
        const {origin, average_price, category_id, subcategory_id} = req.query;
        const whereClause = {};
        if (origin) {
            whereClause.origin = origin;
        }
        if (average_price) {
            whereClause.average_price = average_price;
        }
        if (category_id) {
            whereClause.category_id = category_id;
        }
        if (subcategory_id) {
            whereClause.subcategory_id = subcategory_id;
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20
        const offset = (page - 1) * limit

        const {count, rows} = await Products.findAndCountAll(
            {
                limit,
                offset,
                where: whereClause,
                attributes: {exclude: ['pro_tsv', 'tags', 'other_variant', 'createdAt', 'updatedAt']},
                include: [{
                    model: ImageProduct, as: "image_products", attributes: {exclude: ['product_id']}
                }],
            }
        )

        if (!rows || rows.length === 0) {
            return res.status(statusCode.errorHandle).json({message: 'No product found'});
        } else {
            return res.status(statusCode.success).json({
                current_page: page,
                total_items: count,
                current_items: rows.length,
                total_pages: Math.ceil(count / limit),
                data: rows,
            })
        }

    } catch (err) {
        console.log(chalk.red(err));
        return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
    }
})

//get product's info by user (customer)
router.get('/api/public/get-product-by-id/:id', async (req, res) => {
    try {
        const product = await Products.findOne({
            where: {id: req.params.id},
            attributes: {exclude: ['pro_tsv', 'tags', 'other_variant', 'createdAt', 'updatedAt']},
            include: [
                {
                    model: ImageProducts,
                    as: "ImageProducts",
                    attributes: ['image_link'],
                },
                {
                    model: ProductVariants,
                    as: "ProductVariants",
                    attributes: ['id', 'name', 'price', 'sku'],
                    include: [{
                        model: ProductAttributes,
                        as: "ProductAttributes",
                        attributes: ['name_att', 'value_att'],
                    }]
                },
                {
                    model: FeaturedProduct, as: "FeaturedProduct", attributes: ['product_wishlist'],
                }
            ],
        });
        if (!product) {
            return res.status(statusCode.errorHandle).json({message: "No product found with this id"});
        }

        res.status(statusCode.success).json(product);
    } catch (err) {
        console.log(chalk.red(err));
        return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
    }
})

//get products by price in range
router.get('/api/public/get-product-by-price', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20
        const offset = (page - 1) * limit

        const {count, rows} = await Products.findAndCountAll({
            limit,
            offset,
            where: {
                average_price: {
                    [Op.between]: [parseInt(req.body.p1), parseInt(req.body.p2)]
                }
            }
        });
        if (!rows || rows.length === 0) {
            return res.status(statusCode.errorHandle).json({message: 'No product found'});
        } else {
            return res.status(statusCode.success).json({
                current_page: page,
                total_items: count,
                current_items: rows.length,
                total_pages: Math.ceil(count / limit),
                data: rows,
            });
        }
    } catch (err) {
        console.log(chalk.red(err));
        return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
    }
});

//get products by keyword
router.get('/api/public/search-product', async (req, res) => {
    try {
        const key = req.query.keyword.toLowerCase();

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20
        const offset = (page - 1) * limit

        const {count, rows} = await Products.findAndCountAll({
            limit,
            offset,
            where: Sequelize.literal(`pro_tsv @@ plainto_tsquery('store.vn_unaccent', '${key}')`),
            attributes: {
                exclude: ['pro_tsv', 'createdAt', 'updatedAt', 'tags']
            }
        });

        return res.status(statusCode.success).json({
            current_page: page,
            total_items: count,
            current_items: rows.length,
            total_pages: Math.ceil(count / limit),
            data: rows,
        });
    } catch (err) {
        catchAndShowError(err, res);
    }
})

//get all products by vendor (brand)
router.get('/api/vendor/get-all-products', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        res.status(statusCode.accessDenied).json({message: 'You can not access this action'});
    } else
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20
            const offset = (page - 1) * limit

            console.log({limit, offset});


            const {count, rows} = await Products.findAndCountAll({
                limit,
                offset,
                where: {brand_id: req.user.id},
                attributes: ['id', 'name', 'status'],
            })

            console.log(count, rows);

            return res.status(statusCode.success).json({
                current_page: page,
                total_items: count,
                current_items: rows.length,
                total_pages: Math.ceil(count / limit),
                data: rows,
            })

        } catch (e) {
            catchAndShowError(e, res);
        }
})

//get product's info by vendor (brand)
router.get('/api/vendor/get-product-by-id/:id', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You can not access this action'});
    } else
        try {
            const result = await Products.findOne({
                where: {id: req.params.id},
                include: [{
                    model: ImageProducts, as: "ImageProducts", attributes: {exclude: ['product_id']}
                }]
            })

            if (result === 0) {
                return res.status(statusCode.errorHandle).json({message: 'No product found'});
            } else {
                return res.status(statusCode.success).json(result);
            }
        } catch (err) {
            catchAndShowError(err, res);
        }
})

//post: create a new product
router.post('/api/vendor/create-products', authenticateAccessToken, upload.array('images', 10), async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        res.status(statusCode.accessDenied).json({message: 'You can not access this action'});
    } else
        try {
            const tags = req.body.tags !== null || req.body.tags !== '' ? req.body.tags.split(",") : [];

            if (!req.files || req.files.length === 0) {
                res.status(statusCode.errorHandle).json({message: 'Can not found image files!'});
            } else {
                const newProduct = await Products.create({
                    id: generateID('PROD'),
                    category_id: req.body.category_id,
                    subcategory_id: req.body.subCategory_id,
                    brand_id: req.user.id,
                    name: req.body.name,
                    origin: req.body.origin,
                    average_price: req.body.average_price,
                    description: req.body.description,
                    stock: req.body.stock ?? 0,
                    status: req.body.status ?? 'OUT_OF_STOCK',
                    tags: tags,
                    pro_tsv: Sequelize.literal(`to_tsvector('store.vn_unaccent', '${req.body.name} ${req.body.description} ${req.body.tags}')`)
                });

                if (!newProduct) {
                    res.status(statusCode.errorHandle).json({message: 'Create failed! Please check fields again!'});
                } else {
                    await FeaturedProduct.create({
                        id: createID('FPRD'),
                        product_id: newProduct.id,
                    })

                    const imageUrl = await uploadToCloudinary(req.files, process.env.CLOUD_ASSET_F_PROD);

                    if (!imageUrl) {
                        return res.status(statusCode.errorHandle).json({message: 'Upload image files failed!'});
                    } else {
                        const imageProduct = imageUrl.map((item) => {
                            ImageProduct.create({
                                id: createID('IMG'),
                                image_id: getPublicIdFromURL(item, process.env.CLOUD_ASSET_F_PROD),
                                product_id: newProduct.id,
                                image_link: item,
                            });
                        })

                        if (!imageProduct) {
                            return res.status(statusCode.errorHandle).json({message: 'Upload Image failed! Please try again'});
                        } else return res.status(statusCode.success).json({message: 'Product created!'});
                    }
                }
            }
        } catch (err) {
            catchAndShowError(err, res);
        }
})

//put: hide/un-hide product
router.put('/api/vendor/disabled-products', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        res.status(statusCode.accessDenied).json({message: 'You can not access this action'});
    } else
        try {
            const product = await Products.update(
                {status: req.body.status},
                {
                    where: {id: req.body.id}
                }
            );
            if (!product) {
                res.status(statusCode.errorHandle).json({message: 'No product found with this id'});
            } else {
                res.status(statusCode.success).json('Successfully disabled product');
            }
        } catch (err) {
            catchAndShowError(err, res);
        }
})

//put: update product
router.put('/api/vendor/update-product/:id', authenticateAccessToken, upload.array('images', 10), async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You can not access this action'});
    } else
        try {
            const product = await Products.findOne({
                where: {
                    id: req.params.id
                }
            });

            if (!product) {
                return res.status(statusCode.errorHandle).json({message: 'Product not found!'});
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

            if (req.body.name && req.body.description && req.body.tags) {
                updateFields.pro_tsv = Sequelize.literal(`to_tsvector('store.vn_unaccent', '${req.body.name} ${req.body.description} ${req.body.tags.split(",")}')`)
            }

            //update data in product table
            if (Object.keys(updateFields).length > 0) {
                const update = await Products.update(updateFields, {
                    where: {
                        id: req.params.id
                    }
                });

                if (!update[0]) {
                    return res.status(statusCode.errorHandle).json({message: 'Update failed! Please check fields again!'});
                } else {
                    //after that, update image to ImageProduct table
                    //first, find and delete all publicID in req.body.deletedImage
                    if (req.body.deletedImages && req.body.deletedImages.length > 0) {
                        for (const image of JSON.parse(req.body["deletedImages"])) {
                            //if destroy successfully
                            const res = await destroyToCloudinary(image);
                            console.error('error: ', res)
                            //when destroyed, cloudinary will send a json with content: {'result':'ok}
                            if (res.result === 'ok') {
                                // console.log(`Image with public id: ${image["image_id"]} was deleted by vendor: ${req.user.id}`);
                                const effectRows = await ImageProducts.destroy({
                                    where: {image_id: image.image_id}
                                })
                                if (effectRows > 0) {
                                } else return res.status(statusCode.errorHandle).json({message: 'Effect Rows deleted'});
                            } else console.error(`Image with this public id: ${image["image_id"]} was not deleted!`)
                        }
                    }
                }

                //next, upload all image from req.body.images
                const imageUrl = await uploadToCloudinary(req.files, process.env.CLOUD_ASSET_F_PROD);

                if (!imageUrl) {
                    return res.status(statusCode.errorHandle).json({message: 'Upload image files failed!'});
                } else {
                    const imageProduct = imageUrl.map((item) => {
                        ImageProducts.create({
                            id: generateID('IMG'),
                            image_id: getPublicIdFromURL(item, process.env.CLOUD_ASSET_F_PROD),
                            product_id: req.body.id,
                            image_link: item,
                        });
                    })

                    if (!imageProduct) {
                        return res.status(statusCode.errorHandle).json({message: 'Upload Image failed! Please try again'});
                    }

                    return res.status(statusCode.success).json({message: 'Update successful!'});
                }
            }
        } catch (err) {
            catchAndShowError(err, res);
        }
})

//delete: delete product permanent
router.delete('/api/vendor/delete-product', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'You can not access this action'});
    } else
        try {
            const result = await Products.destroy({
                where: {id: req.body.id}
            })
            if (!result) {
                return res.status(statusCode.errorHandle).json({message: 'No product found with this id'});
            }

            //running websocket event when delete successfully
            return res.status(statusCode.success).json({message: 'Product deleted!'});
        } catch (err) {
            catchAndShowError(err, res);
        }
})

module.exports = router;