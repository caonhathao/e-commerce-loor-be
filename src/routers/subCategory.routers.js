const _express = require('express');
const router = _express.Router();
const {SubCategory} = require('../models/_index');
const {createID} = require('../utils/global_functions');
const multer = require('multer');
const {authenticateAccessToken} = require("../security/JWTAuthentication");
const upload = multer();

//Post
//Create new sub category
router.post('/api/manager/create-sub-category', authenticateAccessToken, upload.none(), async (req, res) => {
    try {
        const id = createID('SUB-CAT');
        const sub = await SubCategory.create({
            id: id,
            category_id: req.body.category_id,
            name: req.body.name,
            description: req.body.description,
        });
        if (!sub) {
            res.status(404).json('Creating failed!');
        }
        res.status(200).json('Created sub category successfully!' + req.body.name);
    } catch (err) {
        console.log(err);
    }
})

//Update sub category
router.put('/api/manager/update-sub-category/:id', authenticateAccessToken, upload.none(), async (req, res) => {
    try {
        const result = await SubCategory.update(
            {
                category_id: req.body.category_id,
                name: req.body.name,
                description: req.body.description,
            },
            {
                where: {
                    id: req.params.id,
                }
            });
        if (!result) {
            res.status(404).json('Updating failed! Please check fields again');
        } else res.status(200).json('Updated sub category successfully!');
    } catch (err) {
        console.log(err);
    }
})

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

//delete:
//delete any sub category by id
router.delete('/api/manager/delete-sub-category/:id', authenticateAccessToken, async (req, res) => {
    try {
        const result = await SubCategory.destroy({
            where: {
                id: req.params.id
            }
        });
        if (!result) {
            res.status(404).json({message: 'Deleted failed!'});
        }
        res.status(200).json('Deleted sub category successfully!');
    } catch (err) {
        console.log(err);
    }
})
module.exports = router;