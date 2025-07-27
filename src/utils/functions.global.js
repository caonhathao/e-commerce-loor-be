const crypto = require('crypto');
const {v4: uuidv4} = require('uuid');

function createID(str) {
    return str+'-'+uuidv4().split('-')[0];
}

function encryptPW(str) {
    return crypto.createHash('sha256').update(str).digest('hex');
}

function getPublicIdFromURL(url, assetFolder) {
    const startIndex = url.lastIndexOf(assetFolder);
    return url.substring(startIndex, url.lastIndexOf('.'));
}

function formatTemplate(template, variables) {
    console.log(template, variables);

    return template.replace(/\$\{(\w+)\}/g, (_, key) => variables[key] || '');
}

module.exports = {createID,formatTemplate, encryptPW, getPublicIdFromURL};