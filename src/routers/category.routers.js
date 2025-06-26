//these API is for category management, use them by manager role
const _express = require('express');
const router = _express.Router();
const statusCode = require('../utils/statusCode');

const multer = require('multer');
const upload = multer();

const {Category, SubCategory, ImageProduct} = require('../models/_index');
const {createID, getPublicIdFromURL} = require("../utils/global_functions");
const {authenticateAccessToken} = require("../security/JWTAuthentication");
const {uploadToCloudinary, destroyToCloudinary} = require("../controllers/uploadController");
const chalk = require('chalk');

//GET DATA
//get all Category
router.get('/api/public/get-all-category', async (req, res) => {
    try {
        const allCategory = await Category.findAll();
        if (!allCategory) {
            res.status(404).json({message: 'Fetching data failed'});
        } else res.status(200).json(allCategory);
    } catch (err) {
        console.log(chalk.red('Error while handle: ', err))
        res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
    }
});

//POST
//create new category
router.post('/api/manager/create-category', authenticateAccessToken, upload.array('images', 10), async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER') {
        res.status(statusCode.accessDenied).json({message: 'Access denied!'});
    } else
        try {
            if (!req.files || req.files.length === 0) {
                res.status(statusCode.missingModule).json({message: 'Please upload images'});
            } else {
                const imageUrl = await uploadToCloudinary(req.files, process.env.CLOUD_ASSET_F_C);
                if (!imageUrl) {
                    res.status(statusCode.errorHandle).json({message: 'Upload image failed!'});
                } else {
                    const idCategory = createID('CAT');
                    const newCategory = await Category.create({
                        id: idCategory,
                        name: req.body.name,
                        description: req.body.description,
                        image_link: imageUrl.toString()
                    })
                    if (!newCategory) {
                        res.status(statusCode.errorHandle).json({message: 'Create category failed'});
                    }
                    res.status(statusCode.success).json('Created successfully');
                }
            }
        } catch (err) {
            console.log(chalk.red('Error while handle: ', err))
            res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
})

//update category
router.put('/api/manager/update-category/:id', authenticateAccessToken, upload.array('images', 10), async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER') {
        res.status(statusCode.accessDenied).json({message: 'Access denied!'});
    } else
        try {
            const item = await Category.findOne({
                where: {
                    id: req.params.id
                }
            })
            if (!item) {
                res.status(statusCode.errorHandle).json({message: 'Category not found'});
            }

            const updateFields = {};

            if (req.body.name && req.body.name !== '') {
                updateFields['name'] = req.body.name;
            }
            if (req.body.description && req.body.description !== '') {
                updateFields['description'] = req.body.description;
            }

            if (Object.keys(updateFields).length > 0) {

                const [effectRows] = await Category.update(updateFields, {
                    where: {id: req.params.id}
                })

                if (effectRows === 0) {
                    res.status(statusCode.errorHandle).json({message: 'Updating data failed'});
                }
            }
            if (req.files && req.files.length > 0) {
                const imageUrl = await uploadToCloudinary(req.files, process.env.CLOUD_ASSET_F_C);

                if (!imageUrl) {
                    res.status(statusCode.errorHandle).json({message: 'Upload image failed!'});
                }

                const response = await Category.update(
                    {image_link: imageUrl.toString()}, {
                        where: {id: req.params.id}
                    })
                if (!response) {
                    res.status(statusCode.errorHandle).json({message: 'Update image failed!'});
                }
                res.status(statusCode.success).json('Updated successfully');
            }
            res.status(statusCode.success).json('Updated successfully');
        } catch (err) {
            console.log(chalk.red('Error while handle: ', err))
            res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
});

//DELETE
router.delete('/api/manager/delete-category/:id', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER') {
        res.status(statusCode.accessDenied).json({message: 'Access denied!'});
    } else
        try {
            const obj = await Category.findOne({
                where: {
                    id: req.params.id
                }
            })

            if (!obj) {
                res.status(statusCode.errorHandle).json({message: 'Category not found'});
            }

            const imageUrl = obj.imageLink;
            const removeImage = await destroyToCloudinary(getPublicIdFromURL(imageUrl, process.env.CLOUD_ASSET_F_C));
            if (removeImage.result !== 'ok') {
                res.status(statusCode.errorHandle).json({message: 'Removing image failed!'});
            } else {
                const result = await Category.destroy({
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