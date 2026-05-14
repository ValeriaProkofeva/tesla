// client/src/context/ChatContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user, token, loading: authLoading } = useAuth();
  const { success, error: showError } = useToast();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeChats, setActiveChats] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [unreadCounts, setUnreadCounts] = useState({});

  // Подключение к WebSocket - только когда есть токен и пользователь загружен
  useEffect(() => {
    // Ждем завершения загрузки авторизации
    if (authLoading) return;
    
    // Проверяем наличие пользователя и токена
    if (!user || !token) {
      console.log('No user or token, skipping WebSocket connection');
      return;
    }

    console.log('Connecting to WebSocket with user:', user.id);

    const newSocket = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('new_message', (data) => {
      console.log('New message received:', data);
      
      // Добавляем сообщение в соответствующий чат
      setMessages(prev => ({
        ...prev,
        [data.roomId]: [...(prev[data.roomId] || []), {
          id: data.id,
          senderId: data.senderId,
          message: data.message,
          createdAt: data.createdAt,
          isRead: false,
        }],
      }));
      
      // Обновляем счетчик непрочитанных
      if (data.senderId !== user.id) {
        setUnreadCounts(prev => ({
          ...prev,
          [data.roomId]: (prev[data.roomId] || 0) + 1,
        }));
        
        // Уведомление
        success(`Новое сообщение от ${data.senderName || 'менеджера'}`);
      }
    });

    newSocket.on('user_typing', (data) => {
      setTypingUsers(prev => ({
        ...prev,
        [data.userId]: data.isTyping,
      }));
      setTimeout(() => {
        setTypingUsers(prev => ({ ...prev, [data.userId]: false }));
      }, 2000);
    });

    newSocket.on('user_online', (data) => {
      setOnlineUsers(prev => new Set([...prev, data.userId]));
    });

    newSocket.on('user_offline', (data) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    });

    newSocket.on('joined_room', (data) => {
      console.log('Joined room:', data.roomId);
    });

    newSocket.on('error', (data) => {
      console.error('Socket error:', data);
      showError(data.message);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user, token, authLoading, success, showError]);


  const getDefaultManager = useCallback(async () => {
  if (!token) return null;
  
  try {
    console.log('Fetching default manager...');
    const response = await fetch('http://localhost:5000/api/chats/manager/default', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      console.error('Failed to get default manager:', response.status);
      return null;
    }
    
    const data = await response.json();
    console.log('Default manager:', data.manager);
    return data.manager;
  } catch (error) {
    console.error('Error getting default manager:', error);
    return null;
  }
}, [token]);

  // Загрузка списка чатов
  const fetchChats = useCallback(async () => {
    if (!user || !token) return;
    
    try {
      const url = user.role === 'manager' || user.role === 'admin'
        ? 'http://localhost:5000/api/chats/manager/chats'
        : 'http://localhost:5000/api/chats/user/chats';
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        console.error('Failed to fetch chats:', response.status);
        return;
      }
      
      const data = await response.json();
      setActiveChats(data.rooms || []);
      
      // Обновляем счетчики непрочитанных
      const counts = {};
      data.rooms?.forEach(room => {
        if (room.unreadCount > 0) {
          counts[room.id] = room.unreadCount;
        }
      });
      setUnreadCounts(counts);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  }, [user, token]);

  // Загрузка истории сообщений
  const loadMessages = useCallback((roomId) => {
    if (!socket || !roomId) return;
    
    socket.emit('get_history', { roomId, limit: 100 });
  }, [socket]);

  // Обработчик истории сообщений
  useEffect(() => {
    if (!socket) return;
    
    const handleHistory = (data) => {
      if (data?.messages) {
        setMessages(prev => ({
          ...prev,
          [data.roomId]: data.messages,
        }));
      }
    };
    
    socket.on('history', handleHistory);
    
    return () => {
      socket.off('history', handleHistory);
    };
  }, [socket]);

  // Обработчик отправки сообщения
  useEffect(() => {
    if (!socket) return;
    
    const handleMessageSent = (data) => {
      console.log('Message sent:', data);
      if (data?.roomId && data?.message) {
        setMessages(prev => ({
          ...prev,
          [data.roomId]: [...(prev[data.roomId] || []), {
            id: data.id,
            senderId: user?.id,
            message: data.message,
            createdAt: data.createdAt,
            isRead: false,
          }],
        }));
      }
    };
    
    socket.on('message_sent', handleMessageSent);
    
    return () => {
      socket.off('message_sent', handleMessageSent);
    };
  }, [socket, user]);

  // Открытие чата
  const openUserChat = useCallback(async (managerId, managerName) => {
  if (!token) return null;
  
  try {
    const response = await fetch(`http://localhost:5000/api/chats/user/start/${managerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!response.ok) {
      console.error('Failed to open user chat:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    const room = {
      id: data.room.id,
      managerId: data.room.managerId,
      manager: { id: data.room.managerId, name: managerName },
    };
    
    setCurrentRoom(room);
    
    // Присоединяемся к комнате
    if (socket) {
      socket.emit('join_room', { roomId: data.room.id });
    }
    
    // Загружаем сообщения
    setMessages(prev => ({
      ...prev,
      [data.room.id]: data.messages || [],
    }));
    
    // Обнуляем счетчик непрочитанных для этой комнаты
    setUnreadCounts(prev => ({ ...prev, [data.room.id]: 0 }));
    
    return data.room.id;
  } catch (error) {
    console.error('Error opening user chat:', error);
    showError('Не удалось открыть чат');
    return null;
  }
}, [token, socket, showError]);

// Открытие чата (для менеджеров)
const openManagerChat = useCallback(async (userId, userName) => {
  if (!token) return null;
  
  try {
    const response = await fetch(`http://localhost:5000/api/chats/manager/chat/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!response.ok) {
      console.error('Failed to open manager chat:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    const room = {
      id: data.room.id,
      userId: data.room.userId,
      userName,
      user: { id: data.room.userId, name: userName },
    };
    
    setCurrentRoom(room);
    
    // Присоединяемся к комнате
    if (socket) {
      socket.emit('join_room', { roomId: data.room.id });
    }
    
    // Загружаем сообщения
    setMessages(prev => ({
      ...prev,
      [data.room.id]: data.messages || [],
    }));
    
    // Обнуляем счетчик непрочитанных для этой комнаты
    setUnreadCounts(prev => ({ ...prev, [data.room.id]: 0 }));
    
    return data.room.id;
  } catch (error) {
    console.error('Error opening manager chat:', error);
    showError('Не удалось открыть чат');
    return null;
  }
}, [token, socket, showError]);

// Выбираем нужную функцию в зависимости от роли
const openChat = useCallback(async (targetId, targetName) => {
  if (user?.role === 'manager' || user?.role === 'admin') {
    return openManagerChat(targetId, targetName);
  } else {
    return openUserChat(targetId, targetName);
  }
}, [user, openManagerChat, openUserChat]);

  // Отправка сообщения
  const sendMessage = useCallback((roomId, message, receiverId) => {
    if (!socket || !message.trim()) return false;
    
    socket.emit('send_message', { roomId, message, receiverId });
    return true;
  }, [socket]);

  // Индикатор набора текста
  const sendTyping = useCallback((roomId, isTyping) => {
    if (!socket) return;
    
    socket.emit('typing', { roomId, isTyping });
  }, [socket]);

  // Отметка о прочтении
  const markAsRead = useCallback((roomId, messageIds) => {
    if (!socket || !messageIds?.length) return;
    
    socket.emit('mark_read', { roomId, messageIds });
    setUnreadCounts(prev => ({ ...prev, [roomId]: 0 }));
  }, [socket]);

  // Получение списка пользователей для чата (менеджер)
  const getUsersForChat = useCallback(async () => {
    if (!token) return [];
    
    try {
      const response = await fetch('http://localhost:5000/api/chats/manager/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        console.error('Failed to fetch users:', response.status);
        return [];
      }
      
      const data = await response.json();
      return data.users || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }, [token]);

  // Массовая рассылка
  const sendBroadcast = useCallback(async (message, recipientType, customUserIds = []) => {
    if (!token) return false;
    
    try {
      const response = await fetch('http://localhost:5000/api/chats/manager/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, recipientType, customUserIds }),
      });
      
      const data = await response.json();
      if (response.ok) {
        success(data.message);
        return true;
      } else {
        showError(data.error || 'Ошибка отправки');
        return false;
      }
    } catch (error) {
      console.error('Error sending broadcast:', error);
      showError('Ошибка отправки');
      return false;
    }
  }, [token, success, showError]);

  // Получить онлайн-статус пользователя
  const isUserOnline = useCallback((userId) => {
    return onlineUsers.has(userId);
  }, [onlineUsers]);

  // Получить общее количество непрочитанных
  const totalUnread = useCallback(() => {
    return Object.values(unreadCounts).reduce((a, b) => a + b, 0);
  }, [unreadCounts]);

  // Выход из чата
  const leaveChat = useCallback(() => {
    if (currentRoom?.id && socket) {
      socket.emit('leave_room', { roomId: currentRoom.id });
    }
    setCurrentRoom(null);
  }, [currentRoom, socket]);

  const value = {
    socket,
    isConnected,
    activeChats,
    fetchChats,
    currentRoom,
    setCurrentRoom,
    messages,
    loadMessages,
    openChat,
    sendMessage,
    sendTyping,
    markAsRead,
    typingUsers,
    onlineUsers,
    isUserOnline,
    unreadCounts,
    totalUnread,
    getUsersForChat,
    sendBroadcast,
    leaveChat,
     getDefaultManager,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};