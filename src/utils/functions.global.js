const crypto = require('crypto');
const {v4: uuidv4} = require('uuid');
const chalk = require('chalk');
const statusCode = require('../utils/statusCode');

function createID(str) {
    return str+'-'+uuidv4().split('-')[0];
}

function encryptPW(str) {
    return crypto.createHash('sha256').update(str).digest('hex');
}

function getPublicIdFromURL(url, assetFolder) {
    console.log(chalk.blue('url:'), url);
    console.log(chalk.blue('assetFolder:'), assetFolder)
    const startIndex = url.lastIndexOf(assetFolder);
    return url.substring(startIndex, url.lastIndexOf('.'));
}

function formatTemplate(template, variables) {
    return template.replace(/\$\{(\w+)\}/g, (_, key) => variables[key] || '');
}

function catchAndShowError(err,res) {
    console.error(chalk.red('Error name:'), err.name);

    if (err.errors) {
        err.errors.forEach((e, i) => {
            console.error(chalk.red(`\n[Error ${i + 1}]`));
            console.error(chalk.red('Path:'), e.path);
            console.error(chalk.red('Value:'), e.value);
            console.error(chalk.red('Message:'), e.message);
        });
    } else {
        // fallback nếu không phải Sequelize lỗi chuẩn
        console.error(chalk.red('Full Error:'), err);
    }

    return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
}

module.exports = {createID,formatTemplate, encryptPW, getPublicIdFromURL,catchAndShowError};