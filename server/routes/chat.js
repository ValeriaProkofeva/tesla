import express from 'express';
import { User, ChatRoom, ChatMessage } from '../models/index.js'; // Добавить ChatRoom, ChatMessage

import {
  getManagerChats,
  getChatWithUser,
  getUserChats,
  broadcastMessage,
  getUsersForChat,
} from '../controllers/chatController.js';
import { authMiddleware, adminMiddleware, canManageRequests } from '../middleware/auth.js';

const router = express.Router();

router.get('/manager/chats', authMiddleware, canManageRequests, getManagerChats);
router.get('/manager/users', authMiddleware, canManageRequests, getUsersForChat);
router.get('/manager/chat/:userId', authMiddleware, canManageRequests, getChatWithUser);
router.post('/manager/broadcast', authMiddleware, canManageRequests, broadcastMessage);

router.get('/manager/default', authMiddleware, async (req, res) => {
  try {
    // Сначала ищем менеджера
    let manager = await User.findOne({
      where: { role: 'manager' },
      attributes: ['id', 'name', 'email'],
    });
    
    // Если менеджера нет, берем администратора
    if (!manager) {
      manager = await User.findOne({
        where: { role: 'admin' },
        attributes: ['id', 'name', 'email'],
      });
    }
    
    res.json({ manager });
  } catch (error) {
    console.error('Get default manager error:', error);
    res.status(500).json({ error: 'Ошибка при получении менеджера' });
  }
});

router.get('/user/start/:managerId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { managerId } = req.params;
    
    // Находим или создаем комнату чата
    let room = await ChatRoom.findOne({
      where: {
        userId: userId,
        managerId: managerId,
      },
    });
    
    if (!room) {
      room = await ChatRoom.create({
        userId: userId,
        managerId: managerId,
        status: 'active',
      });
    }
    
    const messages = await ChatMessage.findAll({
      where: { roomId: room.id },
      order: [['createdAt', 'ASC']],
    });
    
    // Дешифруем сообщения (без функции decryptMessage пока)
    const plainMessages = messages.map(msg => ({
      id: msg.id,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      message: msg.encryptedMessage, // временно показываем зашифрованное
      isRead: msg.isRead,
      createdAt: msg.createdAt,
    }));
    
    res.json({ room, messages: plainMessages });
  } catch (error) {
    console.error('Start user chat error:', error);
    res.status(500).json({ error: 'Ошибка при создании чата' });
  }
});

router.get('/user/chats', authMiddleware, getUserChats);

export default router;