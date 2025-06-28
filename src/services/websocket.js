const { Server } = require('socket.io');
const chalk = require('chalk');
require('dotenv').config();

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : [];

let io;

module.exports.initWebSocket = function (server) {
    io = new Server(server, {
        cors: {
            origin: function (origin, callback) {
                if (!origin || allowedOrigins.includes(origin)) {
                    console.log(chalk.green(`✅ Allowed origin: ${origin || 'unknown (no origin)'}`));
                    callback(null, true);
                } else {
                    console.log(chalk.yellow(`⚠️ Blocked CORS origin: ${origin}`));
                    // Không throw lỗi để tránh làm crash server
                    callback(null, false); // từ chối nhẹ nhàng
                }
            },
            credentials: true,
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        socket.on('register_user', (userId) => {
            socket.join(`room_${userId}`);
            console.log(chalk.cyan(`🔌 Socket connected: ${socket.id} with user ID: ${userId}`));
        })

        socket.on('disconnect', () => {
            console.log(chalk.gray(`❎ Socket disconnected: ${socket.id}`));
        });
    });

    io.engine.on('connection_error', (err) => {
        console.error(chalk.red('🔥 Socket.IO connection error:'), err.message);
    });

    console.log(chalk.blue('📡 Socket.IO server initialized'));
};

module.exports.getIO = function () {
    if (!io) throw new Error('Socket.IO chưa được khởi động!');
    return io;
};
