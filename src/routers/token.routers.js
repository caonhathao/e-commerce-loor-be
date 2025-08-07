const {router,statusCode, verify, TokenStore, generateAccessToken, generateRefreshToken, TokenUpdate, sendAuthResponse,
    authenticateAccessToken, catchAndShowError
} = require("../shared/router-dependencies");

const {REFRESH_SECRET_KEY} = process.env;
router.post('/api/auth/refresh', async (req, res) => {
    const refreshToken = await req.cookies.refresh;

    if (!refreshToken) {
        return res.status(statusCode.accessDenied).send('No token provided');
    }

    try {
        const decoded = verify(refreshToken, REFRESH_SECRET_KEY);

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
        catchAndShowError(err, res);
    }

})

//post: user logout
router.post('/api/me/logout', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER' && req.user === 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'Access token is invalid'});
    } else
        try {
            let response;
            if (req.user.role === 'ROLE_USER') {
                response = await TokenStore.destroy({
                    where: {
                        user_id: req.user.id,
                        user_type: 'user',
                        IP: req.ip || req.connection.remoteAddress,
                    }
                })
            } else if (req.user.role === 'ROLE_VENDOR') {
                response = await TokenStore.destroy({
                    where: {
                        user_id: req.user.id,
                        user_type: 'brand',
                        IP: req.ip || req.connection.remoteAddress,
                    }
                })
            }

            if (response === 0)
                return res.status(statusCode.errorHandle).json({message: 'Logout failed! Please try again later'});
            else {
                res.clearCookie('refresh', {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'Strict',
                });
                return res.status(statusCode.success).json({message: 'Logout successfully'});
            }
        } catch (err) {
            catchAndShowError(err, res);
        }
})

module.exports = router;