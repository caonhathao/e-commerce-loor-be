const {TokenStore} = require('../models/_index')
const {createID} = require('../utils/global_functions')
const ms = require("ms");
const TokenTracking = async ({userID, userType, token, req, timer}) => {
    console.log('timer', timer);
    const response = await TokenStore.create({
        id: createID('TOKEN'),
        userID: userID,
        userType: userType,
        refresh: token,
        userAgent: req.get('User-Agent') || 'Unknown',
        IP: req.ip || req.connection.remoteAddress,
        expiredAt: new Date(Date.now() + ms(timer)),
        createdAt: new Date(),
        updatedAt: new Date(),
    })

    if (!response) {
        console.error('Error while saving token and data');
        return false
    } else return true
}

const TokenUpdate = async ({userID, token, req, timer}) => {
    const response = await TokenStore.update({
        refresh: token,
        userAgent: req.get('User-Agent') || 'Unknown',
        IP: req.ip || req.connection.remoteAddress,
        expiredAt: new Date(Date.now() + ms(timer)),
        updatedAt: new Date(),
    }, {
        where: {userID: userID}
    })

    if (!response) {
        console.error('Error while updating token and data');
        return false
    } else {
        return true
    }
}

const ValidateToken = async ({userId}) => {
    const response = await TokenStore.findOne({
        where: {userID: userId}
    })

    if (!response) {
        return false
    } else {
        return true
    }
}

module.exports = {TokenTracking, TokenUpdate, ValidateToken}