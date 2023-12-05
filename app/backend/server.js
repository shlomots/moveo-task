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

    // Listen for 'join room' event with roomNumber
    socket.on('join room', (roomNumber) => {
        socket.join(roomNumber); // Join the socket to the room
        console.log(`Socket ${socket.id} joined room ${roomNumber}`);
    });

    // Listen for 'text change' event with data containing room and text
    socket.on('text change', (data) => {
        // data should be an object like { room: '1', text: '...' }
        // Broadcast the text change to all clients in the same room except the one who sent it
        socket.to(data.room).emit('text update', data);
        console.log(`Broadcasted text change in room ${data.room}`);
    });

    // Listen for 'disconnect' event
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
    const room = parseInt(req.query.room, 10);
    res.json({ visitorNumber: visitCounts[room] });
    visitCounts[room]++;
});

server.listen(3001, () => {
    console.log('listening on *:3001');
});