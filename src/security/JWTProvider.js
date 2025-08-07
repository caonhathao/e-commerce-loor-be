const jwt = require('jsonwebtoken');
require('dotenv').config()

const SECRET_KEY = process.env.SECRET_KEY;

function createToken(payload, expiresIn = '1h') {
    return jwt.sign(payload, SECRET_KEY, {expiresIn, algorithm: 'HS256'});
}

function generateAccessToken(payload, expiresIn = '5m') {
    const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;
    return jwt.sign(payload, ACCESS_SECRET_KEY, {expiresIn, algorithm: 'HS256'});
}

function generateRefreshToken(payload, expiresIn = '7d') {
    const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;
    return jwt.sign(payload, REFRESH_SECRET_KEY, {expiresIn, algorithm: 'HS256'});
}

module.exports = {createToken, generateAccessToken, generateRefreshToken};