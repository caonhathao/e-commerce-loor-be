const crypto = require('crypto');

function createID(str) {
    let newID = '';

    for (let i = str.length - 1; i >= str.length - 5; i--) {
        if (i % 2 !== 0) {
            newID += str[i];
        } else newID += str.charCodeAt(i);
    }

    return newID;
}

function encryptPW(str) {
    return crypto.createHash('sha256').update(str).digest('hex');
}

function getPublicIdFromURL(url, assetFolder) {
    const startIndex = url.lastIndexOf(assetFolder);
    return url.substring(startIndex + assetFolder.length + 1, url.lastIndexOf('.'));
}

module.exports = {createID, encryptPW, getPublicIdFromURL};