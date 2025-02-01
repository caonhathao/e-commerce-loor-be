const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
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

module.exports = authenticateToken;