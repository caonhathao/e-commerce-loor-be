//Get all subcategories from any parent-category with category_id:
const {
    router, statusCode, SubCategory, catchAndShowError, authenticateAccessToken, upload, uploadToCloudinary,
    createID, destroyToCloudinary, getPublicIdFromURL
} = require("../shared/router-dependencies");
router.get('/api/public/get-all-sub-from-category/:id', async (req, res) => {
    try {
        const result = await SubCategory.findAll({
            where: {
                category_id: req.params.id,
            }
        });
        if (!result) {
            return res.status(statusCode.errorHandle).json('Fetch data failed! No category found!');
        } else return res.status(statusCode.success).json(result);
    } catch (err) {
        catchAndShowError(err, res)
    }
})

//Get any subcategory's info
router.get('/api/public/get-sub-category/:id', async (req, res) => {
    try {
        const result = await SubCategory.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!result) {
            return res.status(statusCode.errorHandle).json('Fetch data failed! No category found!');
        } else return res.status(statusCode.success).json(result);
    } catch (err) {
        catchAndShowError(err, res)
    }
})

//Post
//Create a new subcategory

router.post('/api/manager/create-sub-category', authenticateAccessToken, upload.array('image', 1), async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER') {
        return res.status(statusCode.accessDenied).json({message: 'Access denied!'});
    } else
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(statusCode.missingModule).json({message: 'Please upload images'});
            } else {
                const imageUrl = await uploadToCloudinary(req.files, process.env.CLOUD_ASSET_F_SCAT);
                if (!imageUrl) {
                    return res.status(statusCode.errorHandle).json({message: 'Upload image failed!'});
                } else {
                    const id = createID('SUB-CAT');
                    const sub = await SubCategory.create({
                        id: id,
                        category_id: req.body.category_id,
                        name: req.body.name,
                        description: req.body.description,
                        image_link: imageUrl.toString()
                    });
                    if (!sub) {
                        return res.status(statusCode.errorHandle).json('Creating failed!');
                    }
                    return res.status(statusCode.success).json('Created successfully');
                }
                return res.status(statusCode.success).json('Created sub category successfully!' + req.body.name);
            }
        } catch (err) {
            catchAndShowError(err, res)
        }
})

//Update sub category
router.put('/api/manager/update-sub-category/:id', authenticateAccessToken, upload.array('images', 10), async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER') {
        return res.status(statusCode.accessDenied).json({message: 'Access denied!'});
    } else
        try {
            const item = await SubCategory.findOne({
                where: {
                    id: req.params.id
                }
            })
            if (!item) {
                return res.status(statusCode.errorHandle).json({message: 'Sub category not found'});
            }

            const updateFields = {};

            if (req.body.name && req.body.name !== '') {
                updateFields['name'] = req.body.name;
            }
            if (req.body.category_id && req.body.category_id !== '') {
                updateFields['category_id'] = req.body.category_id;
            }
            if (req.body.description && req.body.description !== '') {
                updateFields['description'] = req.body.description;
            }

            if (Object.keys(updateFields).length > 0) {
                const [effectRows] = await SubCategory.update(updateFields, {
                    where: {id: req.params.id}
                })

                if (effectRows === 0) {
                    return res.status(statusCode.errorHandle).json({message: 'Updating data failed'});
                }
            }

            if (req.files && req.files.length > 0) {
                const imageUrl = await uploadToCloudinary(req.files, process.env.CLOUD_ASSET_F_SCAT);

                if (!imageUrl) {
                    return res.status(statusCode.errorHandle).json({message: 'Upload image failed!'});
                }

                const response = await SubCategory.update(
                    {image_link: imageUrl.toString()}, {
                        where: {id: req.params.id}
                    })
                if (!response) {
                    return res.status(statusCode.errorHandle).json({message: 'Update image failed!'});
                }
                return res.status(statusCode.success).json('Updated successfully');
            }
            return res.status(statusCode.success).json('Updated successfully');
        } catch (err) {
            catchAndShowError(err, res)
        }
})

//delete:
//delete any sub category by id
router.delete('/api/manager/delete-sub-category/:id', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER') {
        return res.status(statusCode.accessDenied).json({message: 'Access denied!'});
    } else
        try {
            const obj = await SubCategory.findOne({
                where: {
                    id: req.params.id
                }
            })

            if (!obj) {
                return res.status(statusCode.errorHandle).json({message: 'Sub category not found'});
            }

            const imageUrl = obj.image_link;
            const removeImage = await destroyToCloudinary(getPublicIdFromURL(imageUrl, process.env.CLOUD_ASSET_F_SC));
            if (removeImage.result !== 'ok') {
                return res.status(statusCode.errorHandle).json({message: 'Removing image failed!'});
            } else {
                const result = await SubCategory.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                if (!result) {
                    return res.status(statusCode.errorHandle).json({message: 'Deleting failed!'});
                }
                return res.status(statusCode.success).json('Deleted successfully');
            }
        } catch (err) {
            catchAndShowError(err, res)
        }
})
module.exports = router;