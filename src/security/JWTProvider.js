const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;
const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

function createToken(payload, expiresIn = '1h') {
    return jwt.sign(payload, SECRET_KEY, {expiresIn, algorithm: 'HS256'});
}

function generateAccessToken(payload, expiresIn = '5m') {
    return jwt.sign(payload, ACCESS_SECRET_KEY, {expiresIn, algorithm: 'HS256'});
}

function generateRefreshToken(payload, expiresIn = '7d') {
    return jwt.sign(payload, REFRESH_SECRET_KEY, {expiresIn, algorithm: 'HS256'});
}

module.exports = {createToken, generateAccessToken, generateRefreshToken};