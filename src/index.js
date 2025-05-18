const _express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const { createServer } = require('node:http');
const { initWebSocket } = require('./services/websocket');
const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');

// Load biến môi trường
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const app = _express();
app.use(_express.json());
app.use(cors());

// Load routes
const routersPath = path.join(__dirname, 'routers');
fs.readdirSync(routersPath).forEach((file) => {
    if (file.endsWith('.js')) {
        const router = require(path.join(routersPath, file));
        app.use(router);
    }
});

// Tạo HTTP server (cho WebSocket)
const server = createServer(app);

// Chạy migration rồi khởi động server
const runMigrations = require('./migrate');
runMigrations()
    .then(() => {
        console.log('✅ Migrations completed');

        const port = parseInt(process.env.SERVER_PORT) || 3000;
        server.listen(port, () => {
            console.log('🚀 Server running on port:', port);
        });

        initWebSocket(server);
    })
    .catch((err) => {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    });
