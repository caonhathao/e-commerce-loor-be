const {Provinces} = require('../models/_index');
const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer();
const {Sequelize} = require("sequelize");
const chalk = require("chalk");
const statusCode = require("../utils/statusCode");

router.get('/api/public/get-all-provinces', upload.none(), async (req, res) => {
    try {
        const result = await Provinces.findAll({
            attributes: {exclude: ['createdAt', 'updatedAt','type','code_gso','region']},
        })
        if (!result) {
            return res.status(statusCode.errorHandle).json({message: 'No provinces found'});
        } else {
            return res.status(statusCode.success).json(result);
        }

    } catch (err) {
        console.log(chalk.red(err));
        return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
    }
})

module.exports = router;