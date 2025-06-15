//these API is for category management, use them by manager role
const _express = require('express');
const router = _express.Router();

const multer = require('multer');
const upload = multer();

const {Category, SubCategory} = require('../models/_index');
const {createID} = require("../utils/global_functions");

//GET DATA
//get all Category
router.get('/api/category', async (req, res) => {
    try {
        const allCategory = await Category.findAll();
        if (!allCategory) {
            res.status(404).json({message: 'Fetching data failed'});
        } else res.status(200).json(allCategory);
    } catch (err) {
        console.error(err);
    }
});

//POST
//create new category
router.post('/api/manager/create-category', upload.none(), async (req, res) => {
    try {
        const idCategory = createID('CAT');
        const newCategory = await Category.create({
            id: idCategory,
            name: req.body.name,
            description: req.body.description,
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
    console.log(JSON.stringify(req.body));
    try {
        const item = await Category.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!item) {
            res.status(404).json({message: 'Category not found'});
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
                res.status(500).json({message: 'Updating data failed'});
            } else
                res.status(200).json('Updated successfully');
        }
    } catch (err) {

    }
});

//DELETE
router.delete('/api/manager/delete-category/:id', async (req, res) => {
    try {
        const category = await Category.destroy({
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