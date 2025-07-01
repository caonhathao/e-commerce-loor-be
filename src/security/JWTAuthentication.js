const jwt = require('jsonwebtoken');
require('dotenv').config();
const chalk = require('chalk');
const statusCode=require('../utils/statusCode');

function authenticateAccessToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(statusCode.accessDenied).json({message: 'Access token not found'});
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(statusCode.missingModule).json({message: err.message});
            }
            req.user = user;
            next();
        });
    } catch (err) {
        console.error(chalk.red('err: ', err))
        return res.status(statusCode.serverError).json({message: 'Access token is invalid or expired'});
    }
}

module.exports = {authenticateAccessToken};