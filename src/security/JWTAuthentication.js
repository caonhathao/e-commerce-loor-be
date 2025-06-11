const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({message: 'Access token not found'});
    }
    const key = process.env.SECRET_KEY;
    jwt.verify(token, key, (err, user) => {
        if (err) {
            return res.status(403).json({message: err.message});
        }
        req.user = user;
        next();
    })
}

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
        console.error('err: ', err)
        return res.status(403).json({message: 'Access token is invalid or expired'});
    }
}

module.exports = {authenticateToken, authenticateAccessToken};