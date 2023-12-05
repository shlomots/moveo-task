const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require('cors');
const io = new Server(server, {
    cors: {
        origin: "*", // Allows all origins. For production, specify your front-end server's URL.
        methods: ["GET", "POST"]
    }
});
app.use(cors());
app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>'); // Replace with your HTML or route handling
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('text change', (text) => {
        // Broadcast the text change to all clients except the one who sent it
        socket.broadcast.emit('text update', text);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

let visitCounts = {
    "1":0,
    "2":0,
    "3":0,
    "4":0
};

app.get('/visits', (req, res) => {
    const id = 1;
    if (!visitCounts[id]) {
        visitCounts[id] = 0;
    }
    res.json({ visitorNumber: visitCounts[id] });
    visitCounts[id]++;
});

server.listen(3001, () => {
    console.log('listening on *:3001');
});