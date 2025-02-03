//these API is for category management, use them by manager role
const _express = require('express');
const router = _express.Router();

const multer = require('multer');
const upload = multer();

const {categories, subCategories} = require('../models/_index');
const {createID} = require("../utils/global_functions");

//GET DATA
//get all categories
router.get('/api/categories', async (req, res) => {
    try {
        const allCategory = await categories.findAll();
        if (!allCategory) {
            res.status(404).json({message: 'Fetching data failed'});
        } else res.status(200).json(allCategory);
    } catch (err) {
        console.error(err);
    }
});

//get all sub-categories from any categories
router.get('/api/categories/sub-categories/:id', async (req, res) => {
    try {
        const result = await categories.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!result) {
            res.status(404).json({message: 'Fetching data failed'});
        } else {
            const sub = await subCategories.findAll({
                    where: {
                        category_id: result.id
                    }
                }
            );
            if (!sub) {
                res.status(404).json({message: 'Has no sub categories found '});
            } else res.status(200).json(sub);
        }
    } catch (err) {
        console.error(err);
    }
})

//POST
//create new category
router.post('/api/manager/create-category', upload.none(), async (req, res) => {
    try {
        const idCategory = createID(req.body.name);
        const newCategory = await categories.create({
            id: idCategory,
            name: req.body.name,
        })
        if (!newCategory) {
            res.status(404).json({message: 'Create category failed'});
        }
        res.status(200).json('Created successfully');
    } catch (err) {
        console.error(err);
    }
})

//update category
router.put('/api/manager/update-category/:id', upload.none(), async (req, res) => {
    try {
        const category = await categories.update({
            name: req.body.name,
            description: req.body.description,
        }, {
            where: {id: req.params.id}
        })
        if (!category) {
            res.status(404).json({message: 'Updating data failed'});
        } else
            res.status(200).json('Updated successfully');
    } catch (err) {

    }
});

//DELETE
router.delete('/api/manager/delete-category/:id', async (req, res) => {
    try {
        const category = await categories.destroy({
            where: {id: req.params.id}
        });
        if (!category) {
            res.status(404).json({message: 'Deleting failed'});
        } else res.status(200).json('Deleted successfully');
    } catch (err) {
        console.log(err)
    }
})


module.exports = router;