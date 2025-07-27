const ms = require("ms");

function sendAuthResponse(res, data, payload, maxAgeToken, access, refresh) {
    res.cookie('refresh', refresh, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: ms(maxAgeToken),
    });


    res.status(200).json({
        access,
        data
    });
}

module.exports = {sendAuthResponse};
