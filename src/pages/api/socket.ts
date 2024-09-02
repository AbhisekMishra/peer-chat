import { Server } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/next';

const MAX_USERS_PER_ROOM = 10;

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  console.log('Socket is initializing');
  const io = new Server(res.socket.server as any, {
    path: '/api/socket',
    addTrailingSlash: false,
  });
  res.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log('New connection:', socket.id);
    socket.on('join-room', (roomId, peerId) => {
      console.log(`Socket ${socket.id} joining room ${roomId} with peer ID ${peerId}`);
      const room = io.sockets.adapter.rooms.get(roomId);
      if (room && room.size >= MAX_USERS_PER_ROOM) {
        socket.emit('room-full');
        return;
      }

      socket.join(roomId);
      socket.to(roomId).emit('user-connected', peerId);

      socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnecting from room ${roomId}`);
        socket.to(roomId).emit('user-disconnected', peerId);
      });
    });
  });

  res.end();
};

export default SocketHandler;