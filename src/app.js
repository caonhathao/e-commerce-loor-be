const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const myEnv = dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenvExpand.expand(myEnv);

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim());
console.log('token:',process.env.CLOUD_ASSET_F_VARIANT);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

const routersPath = path.join(__dirname, 'routers');
fs.readdirSync(routersPath).forEach((file) => {
    if (file.endsWith('.routers.js')) {
        const router = require(path.join(routersPath, file));
        app.use(router);
    }
});

module.exports = app;
