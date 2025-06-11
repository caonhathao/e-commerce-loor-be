const {createID, encryptPW} = require('../utils/global_functions');

const {TokenStore} = require('../models/_index');

const _express = require('express');
const router = _express.Router();

const multer = require('multer');
const upload = multer();
const {authenticateToken} = require("../security/JWTAuthentication");
const {generateAccessToken, generateRefreshToken} = require('../security/JWTProvider');
const {verify, sign} = require("jsonwebtoken");
const {TokenUpdate} = require("../security/TokenTracking");
const ms = require("ms");

const {REFRESH_SECRET_KEY} = process.env;
router.post('/api/refresh', async (req, res) => {
    const refreshToken = await req.cookies.refresh;

    console.log('refreshToken', req.cookies);

    if (!refreshToken) {
        return res.status(401).send('No token provided');
    }

    try {
        const decoded = verify(refreshToken, REFRESH_SECRET_KEY);
        console.log('decoded', decoded);

        const checkToken = await TokenStore.findOne({
            where: {
                userID: decoded.id
            }
        });

        console.log('checkToken', checkToken);

        if (checkToken.refresh !== refreshToken) {
            return res.status(401).send('Invalid refresh token');
        }

        const payload = {userId: decoded.id, role: decoded.role??'', locked: decoded.locked};
        const newAccessToken = generateAccessToken(payload, process.env.EXPIRE_IN_SHORT);

        const newRefreshToken = generateRefreshToken(payload, process.env.EXPIRE_IN_WEEK);
        const response = await TokenUpdate({
            userID: decoded.id,
            token: newRefreshToken,
            req: req,
            timer: process.env.EXPIRE_IN_WEEK,
        });

        if (!response) {
            res.status(403).send('Can not update refresh token');
        }

        res.cookie('refresh', newRefreshToken, {
            httpOnly: true,
            maxAge: ms(process.env.EXPIRE_IN_WEEK),
            sameSite: 'strict',
            secure: false
        })

        res.status(200).json({access: newAccessToken});
    } catch (err) {
        console.error(err);
        return res.status(403).send('Invalid or expired refresh token');
    }

})
module.exports = router;