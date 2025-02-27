const _express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = _express();
const db = require('./models/_index');

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const {DataTypes} = require("sequelize");
const {createServer} = require("node:http");
const {initWebSocket} = require("./services/websocket");

//middleware
app.use(_express.json());
app.use(cors());

//dotenv
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

//Routes
const routersPath = path.join(__dirname, 'routers');
fs.readdirSync(routersPath).forEach((file) => {
    if (file.endsWith('.js')) {
        const router = require(path.join(routersPath, file));
        app.use(router);
    }
});

//create http server for websocket
const server = createServer(app);

db.sequelize.sync()
    .then(() => {
        const port = parseInt(process.env.SERVER_PORT) || 3000;

        server.listen(port, () => {
            console.log("Server running on port:", port);
        });

        initWebSocket(server)
    })
    .catch((err) => {
        console.error("Failed to sync database:", err.message);
        process.exit(1);
    });