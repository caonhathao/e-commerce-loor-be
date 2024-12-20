//these API is for category management, use them by manager role
const _express = require('express');
const router = _express.Router();
const {categories} = require('../models');
const {createID} = require("../handle_functions/global_functions");

router.get('/api/get-all-categories', async (req, res) => {
    try {
        const allCategory = await categories.findAll();
        if (!allCategory) {
            res.status(404).json({message: 'Fetching data failed'});
        } else res.status(200).json(allCategory);
    } catch (err) {
        console.error(err);
    }
});

router.post('/api/manager/create-category', async (req, res) => {
    try {
        const idCategory = createID(req.body.name);
        const newCategory = await categories.create({
            id: idCategory,
            name: req.body.name,
        })
        res.status(200).json('Created successfully');
    } catch (err) {
        console.error(err);
    }
})

module.exports = router;