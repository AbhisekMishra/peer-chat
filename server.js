const express = require('express');
const https = require('https');
const socketIo = require('socket.io');

const app = express();

// Read SSL certificate files
const options = {
  rejectUnauthorized: false
};

const server = https.createServer(options, app);
const io = socketIo(server, {
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling'], // Force long-polling
  allowEIO3: true // Allow Engine.IO 3 client
});

const MAX_USERS_PER_ROOM = 10;

const sessionStore = new Map();

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);
  
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

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

  // Handle session management
  socket.on('request-session', (sessionId) => {
    if (!sessionId || !sessionStore.has(sessionId)) {
      // Generate a new session ID
      const newSessionId = generateSessionId();
      sessionStore.set(newSessionId, socket.id);
      socket.emit('session-created', newSessionId);
    } else {
      // Reconnect to existing session
      sessionStore.set(sessionId, socket.id);
      socket.emit('session-resumed', sessionId);
    }
  });

  socket.on('disconnect', () => {
    // Remove the session on disconnect
    sessionStore.forEach((value, key) => {
      if (value === socket.id) {
        sessionStore.delete(key);
      }
    });
  });
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server is running on port ${PORT} (HTTPS)`));

// Utility function to generate a unique session ID
function generateSessionId() {
  return 'session_' + Math.random().toString(36).substr(2, 9);
}
