const {TokenStore} = require('../models/_index')
const {createID} = require('../utils/global_functions')
const ms = require("ms");
const chalk = require("chalk");
const TokenTracking = async ({userID, userType, token, req, timer}) => {
    const response = await TokenStore.create({
        id: createID('TOKEN'),
        user_id: userID,
        user_type: userType,
        refresh: token,
        user_agent: req.get('User-Agent') || 'Unknown',
        IP: req.ip || req.connection.remoteAddress,
        expiredAt: new Date(Date.now() + ms(timer)),
        createdAt: new Date(),
        updatedAt: new Date(),
    })
    if (!response) {
        return false
    } else return true
}

const TokenUpdate = async ({userID, token, req, timer}) => {
    const response = await TokenStore.update({
        refresh: token,
        user_agent: req.get('User-Agent') || 'Unknown',
        IP: req.ip || req.connection.remoteAddress,
        expiredAt: new Date(Date.now() + ms(timer)),
        updatedAt: new Date(),
    }, {
        where: {user_id: userID}
    })

    if (!response) {
        return false
    } else {
        return true
    }
}

const ValidateToken = async ({userId}) => {
    const response = await TokenStore.findOne({
        where: {user_id: userId}
    })

    if (!response) {
        return false
    } else {
        return true
    }
}

module.exports = {TokenTracking, TokenUpdate, ValidateToken}