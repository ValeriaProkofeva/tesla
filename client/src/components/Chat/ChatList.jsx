import React, { useEffect, useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import styles from './Chat.module.css';

const ChatList = ({ onSelectChat, selectedChatId }) => {
  const { user } = useAuth();
  const { activeChats, fetchChats, unreadCounts, isUserOnline } = useChat();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChats = async () => {
      setIsLoading(true);
      await fetchChats();
      setIsLoading(false);
    };
    loadChats();
  }, [fetchChats]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 86400000) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 604800000) {
      const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
      return days[date.getDay()];
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    }
  };

  const getDisplayName = (chat) => {
    if (user?.role === 'manager' || user?.role === 'admin') {
      return chat.user?.name || 'Пользователь';
    }
    return chat.manager?.name || 'Менеджер';
  };

  if (isLoading) {
    return <div className={styles.chatListLoading}>Загрузка чатов...</div>;
  }

  if (activeChats.length === 0) {
    return (
      <div className={styles.emptyChatList}>
        <p>У вас пока нет диалогов</p>
        <p className={styles.emptyHint}>Напишите менеджеру, чтобы начать общение</p>
      </div>
    );
  }

  return (
    <div className={styles.chatList}>
      <div className={styles.chatListHeader}>
        <h3>Диалоги</h3>
      </div>
      <div className={styles.chatItems}>
        {activeChats.map((chat) => (
          <div
            key={chat.id}
            className={`${styles.chatItem} ${selectedChatId === chat.id ? styles.active : ''}`}
            onClick={() => onSelectChat(chat)}
          >
            <div className={styles.chatAvatar}>
              {getDisplayName(chat).charAt(0).toUpperCase()}
              {isUserOnline(chat.user?.id) && (
                <span className={styles.onlineIndicator} />
              )}
            </div>
            <div className={styles.chatInfo}>
              <div className={styles.chatName}>{getDisplayName(chat)}</div>
              <div className={styles.chatLastMessage}>
                {chat.lastMessage || 'Нет сообщений'}
              </div>
            </div>
            <div className={styles.chatMeta}>
              <div className={styles.chatTime}>{formatDate(chat.lastMessageAt)}</div>
              {unreadCounts[chat.id] > 0 && (
                <div className={styles.unreadBadge}>{unreadCounts[chat.id]}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;