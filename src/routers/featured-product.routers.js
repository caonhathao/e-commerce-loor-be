const {
    router,
    statusCode,
    catchAndShowError,
    FeaturedProduct,
    Products,
    literal
} = require("../shared/router-dependencies");

router.get('/api/public/get-featured-product', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = req.query.page;
        const offset = (page - 1) * limit;

        const sortBy = req.query.sortBy === 'wishlist' ? 'product_wishlist' : 'product_views';

        const {count, rows} = await FeaturedProduct.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [[sortBy, 'DESC']],
            attributes: {exclude: ['createdAt', 'updatedAt']},
            includes: [{
                model: Products,
                as: 'Products',
            }]
        })
        if (rows === 0) {
            return res.status(statusCode.success).json([]);
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
        catchAndShowError(err, res)
    }
})

router.put('/api/public/add-product-view', async (req, res) => {
    try {
        const product_id = req.body.id;

        const record = await FeaturedProduct.findOne({
            where: {
                product_id: product_id
            }
        })
        if (!record) {
            return res.status(statusCode.errorHandle).json({message: 'Can not access this product'});
        }

        const result = await FeaturedProduct.update(
            {
                product_views: literal('product_views + 1'),
            },
            {
                where: {
                    product_id: product_id
                }
            }
        );

        if (!result) {
            return res.status(statusCode.errorHandle).json({message: 'Can not access this product'});
        }
        return res.status(statusCode.success).json({message: 'Access this product successfully'});

    } catch (err) {
        catchAndShowError(err, res)
    }
})

router.put('/api/public/add-product-wishlist', async (req, res) => {
    try {
        const product_id = req.body.id;
        const isAdd = req.body.is_add

        const record = await FeaturedProduct.findOne({
            where: {
                product_id: product_id
            }
        })
        if (!record) {
            return res.status(statusCode.errorHandle).json({message: 'Can not access this product'});
        }

        let result = {}

        if (isAdd) {
            result = await FeaturedProduct.update(
                {
                    product_wishlist: literal('product_wishlist + 1'),
                },
                {
                    where: {
                        product_id: product_id
                    }
                }
            );
        } else {
            result = await FeaturedProduct.update(
                {
                    product_wishlist: literal('product_wishlist - 1'),
                },
                {
                    where: {
                        product_id: product_id
                    }
                }
            )
        }

        if (!result) {
            return res.status(statusCode.errorHandle).json({message: 'Can not access this product'});
        }
        return res.status(statusCode.success).json({message: 'Access this product successfully'});

    } catch (err) {
        catchAndShowError(err, res)
    }
})

module.exports = router;