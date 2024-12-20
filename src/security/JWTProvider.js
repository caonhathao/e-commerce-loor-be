const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

function createToken(payload, expiresIn = '1h') {
    return jwt.sign(payload, SECRET_KEY, {expiresIn});
}

module.exports = {createToken};