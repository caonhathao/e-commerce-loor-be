const crypto = require('crypto');
const {v4: uuidv4} = require('uuid');

function createID(str) {
    return str+'-'+uuidv4().split('-')[0];
}

function generateID(str) {
    return str+'-'+uuidv4();
}

function encryptPW(str) {
    return crypto.createHash('sha256').update(str).digest('hex');
}

function getPublicIdFromURL(url, assetFolder) {
    const startIndex = url.lastIndexOf(assetFolder);
    return url.substring(startIndex + assetFolder.length + 1, url.lastIndexOf('.'));
}

module.exports = {createID,generateID, encryptPW, getPublicIdFromURL};