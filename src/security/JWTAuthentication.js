const jwt = require('jsonwebtoken');
require('dotenv').config();
const chalk = require('chalk');

function authenticateAccessToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({message: 'Access token not found'});
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({message: err.message});
            }
            req.user = user;
            next();
        });
    } catch (err) {
        console.error(chalk.red('err: ', err))
        return res.status(403).json({message: 'Access token is invalid or expired'});
    }
}

module.exports = {authenticateAccessToken};