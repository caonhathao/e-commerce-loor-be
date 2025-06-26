const _express = require('express');
const router = _express.Router();
const {SubCategory, Category} = require('../models/_index');
const {createID, getPublicIdFromURL} = require('../utils/global_functions');
const multer = require('multer');
const {authenticateAccessToken} = require("../security/JWTAuthentication");
const statusCode = require("../utils/statusCode");
const {uploadToCloudinary, destroyToCloudinary} = require("../controllers/uploadController");
const upload = multer();
const chalk = require('chalk');

//Get
//Get all sub categories from any parent-category with category_id:
router.get('/api/public/get-all-sub-from-category/:id', async (req, res) => {
    try {
        const result = await SubCategory.findAll({
            where: {
                category_id: req.params.id,
            }
        });
        if (!result) {
            res.status(404).json('Fetch data failed! No category found!');
        } else res.status(200).json(result);
    } catch (err) {
        console.error(err);
    }
})

//Get any sub category's info
router.get('/api/public/get-sub-category/:id', async (req, res) => {
    try {
        const result = await SubCategory.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!result) {
            res.status(404).json('Fetch data failed! No category found!');
        } else res.status(200).json(result);
    } catch (err) {
        console.error(err);
    }
})

//Post
//Create new sub category
router.post('/api/manager/create-sub-category', authenticateAccessToken, upload.none(), async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER') {
        res.status(statusCode.accessDenied).json({message: 'Access denied!'});
    } else
        try {
            if (!req.files || req.files.length === 0) {
                res.status(statusCode.missingModule).json({message: 'Please upload images'});
            } else {
                const imageUrl = await uploadToCloudinary(req.files, process.env.CLOUD_ASSET_F_SC);
                if (!imageUrl) {
                    res.status(statusCode.errorHandle).json({message: 'Upload image failed!'});
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
                        res.status(statusCode.errorHandle).json('Creating failed!');
                    }
                    res.status(statusCode.success).json('Created successfully');
                }
                res.status(statusCode.success).json('Created sub category successfully!' + req.body.name);
            }
        } catch (err) {
            console.log(chalk.red('Error while handle: ', err))
            res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
})

//Update sub category
router.put('/api/manager/update-sub-category/:id', authenticateAccessToken, upload.array('images',10), async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER') {
        res.status(statusCode.accessDenied).json({message: 'Access denied!'});
    } else
        try {
            const item = await SubCategory.findOne({
                where: {
                    id: req.params.id
                }
            })
            if (!item) {
                res.status(statusCode.errorHandle).json({message: 'Sub category not found'});
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
                    res.status(statusCode.errorHandle).json({message: 'Updating data failed'});
                }
            }

            if (req.files && req.files.length > 0) {
                const imageUrl = await uploadToCloudinary(req.files, process.env.CLOUD_ASSET_F_SC);

                if (!imageUrl) {
                    res.status(statusCode.errorHandle).json({message: 'Upload image failed!'});
                }

                const response = await SubCategory.update(
                    {image_link: imageUrl.toString()}, {
                        where: {id: req.params.id}
                    })
                if (!response) {
                    res.status(statusCode.errorHandle).json({message: 'Update image failed!'});
                }
                 return res.status(statusCode.success).json('Updated successfully');
            }
            res.status(statusCode.success).json('Updated successfully');
        } catch (err) {
            console.log(chalk.red('Error while handle: ', err))
            res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
})

//delete:
//delete any sub category by id
router.delete('/api/manager/delete-sub-category/:id', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER') {
        res.status(statusCode.accessDenied).json({message: 'Access denied!'});
    } else
        try {
            const obj = await SubCategory.findOne({
                where: {
                    id: req.params.id
                }
            })

            if (!obj) {
                res.status(statusCode.errorHandle).json({message: 'Sub category not found'});
            }

            const imageUrl = obj.image_link;
            const removeImage = await destroyToCloudinary(getPublicIdFromURL(imageUrl, process.env.CLOUD_ASSET_F_SC));
            if (removeImage.result !== 'ok') {
                res.status(statusCode.errorHandle).json({message: 'Removing image failed!'});
            } else {
                const result = await SubCategory.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                if (!result) {
                    res.status(statusCode.errorHandle).json({message: 'Deleting failed!'});
                }
                res.status(statusCode.success).json('Deleted successfully');
            }
        } catch (err) {
            console.log(chalk.red('Error while handle: ', err))
            res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
})
module.exports = router;