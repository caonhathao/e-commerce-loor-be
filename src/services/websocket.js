const {Server} = require('socket.io');
let io;

module.exports.initWebSocket = function (server) {
    io = new Server(server, {
        cors: {origin: "*"},
    });

    io.on('connection', (socket) => {
        console.log(`Connected to ${socket.id}`);
        socket.on('disconnect', () => {
            console.log(`Disconnected from ${socket.id}`);
        })
    });

    console.log('Server is running on port ' + server.address().port);
}

module.exports.getIO = function () {
    if (!io) {
        throw new Error("WebSocket server chưa được khởi động!");
    }
    return io;
};