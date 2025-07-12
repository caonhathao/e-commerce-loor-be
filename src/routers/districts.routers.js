const {createID, encryptPW} = require('../utils/functions.global');

const {Districts} = require('../models/_index');
const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer();
const {Sequelize} = require("sequelize");
const chalk = require("chalk");
const statusCode = require("../utils/statusCode");

router.get('/api/public/get-all-districts/:province_id', upload.none(), async (req, res) => {
    try {
        const result = await Districts.findAll({
            where: {
                province_id: req.params.province_id
            },
            attributes: {exclude: ['createdAt', 'updatedAt','province_id','code_sgo']},
        })

        if (!result && result === 0) {
            return res.status(statusCode.errorHandle).json({message: 'No districts found'});
        } else {
            return res.status(statusCode.success).json(result);
        }

    } catch (err) {
        console.log(chalk.red(err));
        return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
    }
})

module.exports = router;