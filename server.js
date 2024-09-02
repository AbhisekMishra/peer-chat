const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const MAX_USERS_PER_ROOM = 10;

io.on('connection', (socket) => {
  socket.on('join-room', (roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (room && room.size >= MAX_USERS_PER_ROOM) {
      socket.emit('room-full');
      return;
    }

    socket.join(roomId);
    socket.to(roomId).emit('user-connected', socket.id);

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', socket.id);
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));