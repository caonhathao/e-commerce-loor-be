const {TokenStore} = require('../models/_index');

const _express = require('express');
const router = _express.Router();

const {generateAccessToken, generateRefreshToken} = require('../security/JWTProvider');
const {verify, sign} = require("jsonwebtoken");
const {TokenUpdate} = require("../security/TokenTracking");
require("ms");
const {sendAuthResponse} = require("../utils/authUtils");
const chalk = require("chalk");
const statusCode = require("../utils/statusCode");

const {REFRESH_SECRET_KEY} = process.env;
router.post('/api/auth/refresh', async (req, res) => {
    const refreshToken = await req.cookies.refresh;

    if (!refreshToken) {
        return res.status(statusCode.accessDenied).send('No token provided');
    }

    try {
        const decoded = verify(refreshToken, REFRESH_SECRET_KEY);
        console.log(decoded.id)

        const checkToken = await TokenStore.findOne({
            where: {
                user_id: decoded.id
            }
        });

        if (checkToken.refresh !== refreshToken) {
            return res.status(statusCode.accessDenied).json({message: 'Invalid refresh token'});
        }

        const payload = {id: decoded.id, role: decoded.role ?? '', locked: decoded.locked};
        const newAccessToken = generateAccessToken(payload, process.env.EXPIRE_IN_DAY);

        const newRefreshToken = generateRefreshToken(payload, process.env.EXPIRE_IN_WEEK);
        const response = await TokenUpdate({
            user_id: decoded.id,
            token: newRefreshToken,
            req: req,
            timer: process.env.EXPIRE_IN_WEEK,
        });

        if (!response) {
            res.status(statusCode.errorHandle).send('Can not update refresh token');
        }

        sendAuthResponse(res, payload, payload, process.env.EXPIRE_IN_WEEK, newAccessToken, newRefreshToken,)
    } catch (err) {
        console.log(chalk.red('53',err));
        return res.status(statusCode.errorHandle).json({message: 'Invalid or expired refresh token'});
    }

})
module.exports = router;