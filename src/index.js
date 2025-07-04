const { createServer } = require('node:http');
const { initWebSocket } = require('./services/websocket');
const runMigrations = require('./migrate');
const { green } = require('chalk');
const app = require('./app');

const server = createServer(app);

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
