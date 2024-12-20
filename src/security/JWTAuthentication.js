const jwt = require('jsonwebtoken');

function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
        return null;
    }
}