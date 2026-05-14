import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User, ChatRoom, ChatMessage } from '../models/index.js';
import { encryptMessage, decryptMessage } from '../utils/encryption.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const activeUsers = new Map(); 

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user.id;
      socket.userRole = user.role;
      next();
    } catch (error) {
      console.error('Socket auth error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected`);
    
    activeUsers.set(socket.userId, socket.id);
    socket.join(`user_${socket.userId}`);

    if (socket.userRole === 'user') {
      socket.broadcast.emit('user_online', { userId: socket.userId });
    }

    socket.on('join_room', async (data) => {
      const { roomId } = data;
      
      const room = await ChatRoom.findByPk(roomId);
      if (room && (room.userId === socket.userId || room.managerId === socket.userId || socket.userRole === 'admin')) {
        socket.join(`room_${roomId}`);
        console.log(`User ${socket.userId} joined room ${roomId}`);
        
        await ChatMessage.update(
          { isRead: true },
          { where: { roomId, receiverId: socket.userId, isRead: false } }
        );
        
        socket.emit('joined_room', { roomId });
      }
    });

    socket.on('send_message', async (data) => {
      try {
        const { roomId, message, receiverId } = data;
        
        let room = await ChatRoom.findByPk(roomId);
        
        if (!room) {
          room = await ChatRoom.create({
            userId: socket.userId === receiverId ? receiverId : socket.userId,
            managerId: socket.userId === receiverId ? socket.userId : receiverId,
            status: 'active',
          });
        }
        
        if (room.userId !== socket.userId && room.managerId !== socket.userId && socket.userRole !== 'admin') {
          return socket.emit('error', { message: 'Access denied' });
        }
        
        const encryptedMessage = encryptMessage(message);
        
        const newMessage = await ChatMessage.create({
          roomId: room.id,
          senderId: socket.userId,
          receiverId: room.userId === socket.userId ? room.managerId : room.userId,
          encryptedMessage,
          isRead: false,
        });
        
        await room.update({ lastMessageAt: new Date() });
        
        const targetUserId = room.userId === socket.userId ? room.managerId : room.userId;
        const targetSocketId = activeUsers.get(targetUserId);
        
        if (targetSocketId) {
          io.to(targetSocketId).emit('new_message', {
            id: newMessage.id,
            roomId: room.id,
            senderId: socket.userId,
            message: message, 
            createdAt: newMessage.createdAt,
          });
        }
        
        socket.emit('message_sent', {
          id: newMessage.id,
          roomId: room.id,
          message: message,
          createdAt: newMessage.createdAt,
        });
        
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('typing', (data) => {
      const { roomId, isTyping } = data;
      socket.to(`room_${roomId}`).emit('user_typing', {
        userId: socket.userId,
        isTyping,
      });
    });

    socket.on('mark_read', async (data) => {
      const { messageIds } = data;
      await ChatMessage.update(
        { isRead: true },
        { where: { id: messageIds, receiverId: socket.userId } }
      );
    });

    socket.on('get_history', async (data) => {
      try {
        const { roomId, limit = 50, offset = 0 } = data;
        
        const room = await ChatRoom.findByPk(roomId);
        if (!room || (room.userId !== socket.userId && room.managerId !== socket.userId && socket.userRole !== 'admin')) {
          return socket.emit('error', { message: 'Access denied' });
        }
        
        const messages = await ChatMessage.findAll({
          where: { roomId },
          order: [['createdAt', 'DESC']],
          limit,
          offset,
        });
        
        const decryptedMessages = messages.map(msg => ({
          id: msg.id,
          senderId: msg.senderId,
          message: decryptMessage(msg.encryptedMessage),
          isRead: msg.isRead,
          createdAt: msg.createdAt,
        })).reverse();
        
        socket.emit('history', { roomId, messages: decryptedMessages });
      } catch (error) {
        console.error('Get history error:', error);
        socket.emit('error', { message: 'Failed to get history' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
      activeUsers.delete(socket.userId);
      
      if (socket.userRole === 'user') {
        socket.broadcast.emit('user_offline', { userId: socket.userId });
      }
    });
  });

  return io;
};