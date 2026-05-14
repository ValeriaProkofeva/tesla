import { ChatRoom, ChatMessage, User } from '../models/index.js';
import { decryptMessage } from '../utils/encryption.js';
import { Op } from 'sequelize';

export const getManagerChats = async (req, res) => {
  try {
    const managerId = req.user.id;
    
    const rooms = await ChatRoom.findAll({
      where: {
        [Op.or]: [{ managerId }, { userId: managerId }],
        status: 'active',
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: ChatMessage,
          as: 'messages',
          limit: 1,
          order: [['createdAt', 'DESC']],
        },
      ],
      order: [['lastMessageAt', 'DESC']],
    });
    
    const roomsWithUnread = await Promise.all(rooms.map(async (room) => {
      const unreadCount = await ChatMessage.count({
        where: {
          roomId: room.id,
          receiverId: managerId,
          isRead: false,
        },
      });
      
      const lastMessage = room.messages?.[0];
      let lastMessageText = null;
      if (lastMessage) {
        lastMessageText = decryptMessage(lastMessage.encryptedMessage);
      }
      
      return {
        id: room.id,
        user: room.user,
        lastMessage: lastMessageText,
        lastMessageAt: room.lastMessageAt,
        unreadCount,
      };
    }));
    
    res.json({ rooms: roomsWithUnread });
  } catch (error) {
    console.error('Get manager chats error:', error);
    res.status(500).json({ error: 'Ошибка при получении чатов' });
  }
};

export const getChatWithUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const managerId = req.user.id;
    
    let room = await ChatRoom.findOne({
      where: {
        userId,
        managerId,
      },
    });
    
    if (!room) {
      room = await ChatRoom.create({
        userId,
        managerId,
        status: 'active',
      });
    }
    
    const messages = await ChatMessage.findAll({
      where: { roomId: room.id },
      order: [['createdAt', 'ASC']],
    });
    
    const decryptedMessages = messages.map(msg => ({
      id: msg.id,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      message: decryptMessage(msg.encryptedMessage),
      isRead: msg.isRead,
      createdAt: msg.createdAt,
    }));
    
    res.json({ room, messages: decryptedMessages });
  } catch (error) {
    console.error('Get chat with user error:', error);
    res.status(500).json({ error: 'Ошибка при получении чата' });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const rooms = await ChatRoom.findAll({
      where: { userId, status: 'active' },
      include: [
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: ChatMessage,
          as: 'messages',
          limit: 1,
          order: [['createdAt', 'DESC']],
        },
      ],
      order: [['lastMessageAt', 'DESC']],
    });
    
    const roomsWithUnread = await Promise.all(rooms.map(async (room) => {
      const unreadCount = await ChatMessage.count({
        where: {
          roomId: room.id,
          receiverId: userId,
          isRead: false,
        },
      });
      
      const lastMessage = room.messages?.[0];
      let lastMessageText = null;
      if (lastMessage) {
        lastMessageText = decryptMessage(lastMessage.encryptedMessage);
      }
      
      return {
        id: room.id,
        manager: room.manager,
        lastMessage: lastMessageText,
        lastMessageAt: room.lastMessageAt,
        unreadCount,
      };
    }));
    
    res.json({ rooms: roomsWithUnread });
  } catch (error) {
    console.error('Get user chats error:', error);
    res.status(500).json({ error: 'Ошибка при получении чатов' });
  }
};

export const broadcastMessage = async (req, res) => {
  try {
    const { message, recipientType, customUserIds } = req.body;
    const senderId = req.user.id;
    
    const { encryptMessage } = await import('../utils/encryption.js');
    const encryptedMessage = encryptMessage(message);
    
    let targetUsers = [];
    
    if (recipientType === 'all') {
      targetUsers = await User.findAll({
        where: { role: 'user', isBlocked: false },
        attributes: ['id'],
      });
    } else if (recipientType === 'with_requests') {
      const usersWithConsultations = await Consultation.findAll({
        attributes: ['userId'],
        group: ['userId'],
      });
      const userIds = usersWithConsultations.map(c => c.userId);
      targetUsers = await User.findAll({
        where: { id: userIds, isBlocked: false },
        attributes: ['id'],
      });
    } else if (recipientType === 'custom' && customUserIds) {
      targetUsers = await User.findAll({
        where: { id: customUserIds, isBlocked: false },
        attributes: ['id'],
      });
    }
    
    let sentCount = 0;
    
    for (const user of targetUsers) {
      let room = await ChatRoom.findOne({
        where: {
          userId: user.id,
          managerId: senderId,
        },
      });
      
      if (!room) {
        room = await ChatRoom.create({
          userId: user.id,
          managerId: senderId,
          status: 'active',
        });
      }
      
      await ChatMessage.create({
        roomId: room.id,
        senderId,
        receiverId: user.id,
        encryptedMessage,
        isRead: false,
      });
      
      await room.update({ lastMessageAt: new Date() });
      sentCount++;
    }
    
    res.json({
      message: `Сообщение отправлено ${sentCount} пользователям`,
      sentCount,
    });
  } catch (error) {
    console.error('Broadcast error:', error);
    res.status(500).json({ error: 'Ошибка при отправке рассылки' });
  }
};

export const getUsersForChat = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: 'user', isBlocked: false },
      attributes: ['id', 'name', 'email'],
      order: [['name', 'ASC']],
    });
    res.json({ users });
  } catch (error) {
    console.error('Get users for chat error:', error);
    res.status(500).json({ error: 'Ошибка при получении пользователей' });
  }
};