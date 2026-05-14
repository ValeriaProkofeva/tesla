import React, { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ChatWindow from '../Chat/ChatWindow';
import styles from './UserCabinet.module.css';

const UserChat = () => {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const { 
    activeChats, 
    fetchChats, 
    setCurrentRoom,
    totalUnread,
    openChat,
    getDefaultManager
  } = useChat();
  
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [defaultManager, setDefaultManager] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);

  useEffect(() => {
    loadChats();
    loadDefaultManager();
  }, []);

  const loadChats = async () => {
    setLoading(true);
    await fetchChats();
    setLoading(false);
  };

  const loadDefaultManager = async () => {
    const manager = await getDefaultManager();
    setDefaultManager(manager);
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setCurrentRoom(chat);
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
    setCurrentRoom(null);
  };

  const handleStartNewChat = async () => {
  if (!defaultManager) {
    showError('Менеджер временно недоступен');
    return;
  }
  
  setCreatingChat(true);
  const roomId = await openChat(defaultManager.id, defaultManager.name);
  setCreatingChat(false);
  
  if (roomId) {
    success('Чат с менеджером открыт');
    setShowNewChatModal(false);
    await loadChats();
    const existingChat = activeChats.find(chat => 
      chat.manager?.id === defaultManager.id
    );
    if (existingChat) {
      handleSelectChat(existingChat);
    }
  }
};

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

  if (loading) {
    return (
      <div className={styles.loadingChats}>
        <div className={styles.spinner} />
        <p>Загрузка чатов...</p>
      </div>
    );
  }

  if (!selectedChat) {
    return (
      <>
        <div className={styles.userChatContainer}>
          <div className={styles.userChatHeader}>
            <h2 className={styles.sectionTitle}>Мои диалоги</h2>
            <div className={styles.headerActions}>
              {totalUnread() > 0 && (
                <div className={styles.totalUnreadBadge}>
                  Непрочитанных: {totalUnread()}
                </div>
              )}
              <button 
                className={styles.newDialogButton}
                onClick={() => setShowNewChatModal(true)}
                disabled={creatingChat}
              >
                + Новый диалог
              </button>
            </div>
          </div>
          
          {activeChats.length === 0 ? (
            <div className={styles.emptyChats}>
              <div className={styles.emptyIcon}>💬</div>
              <p>У вас пока нет диалогов</p>
              <p className={styles.emptyHint}>
                Нажмите "Новый диалог", чтобы начать общение с менеджером
              </p>
            </div>
          ) : (
            <div className={styles.chatsList}>
              {activeChats.map((chat) => (
                <div
                  key={chat.id}
                  className={styles.chatItem}
                  onClick={() => handleSelectChat(chat)}
                >
                  <div className={styles.chatAvatar}>
                    {chat.manager?.name?.charAt(0).toUpperCase() || 'М'}
                    {chat.unreadCount > 0 && (
                      <span className={styles.unreadDot} />
                    )}
                  </div>
                  <div className={styles.chatInfo}>
                    <div className={styles.chatName}>{chat.manager?.name || 'Менеджер'}</div>
                    <div className={styles.chatLastMessage}>
                      {chat.lastMessage || 'Нет сообщений'}
                    </div>
                  </div>
                  <div className={styles.chatMeta}>
                    <div className={styles.chatTime}>
                      {formatDate(chat.lastMessageAt)}
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className={styles.unreadBadge}>
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showNewChatModal && (
          <div className={styles.modalOverlay} onClick={() => setShowNewChatModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h3>Новый диалог</h3>
              <p>Вы хотите начать новый диалог с менеджером?</p>
              <div className={styles.modalButtons}>
                <button 
                  className={styles.confirmButton}
                  onClick={handleStartNewChat}
                  disabled={creatingChat}
                >
                  {creatingChat ? 'Создание...' : 'Да, начать'}
                </button>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setShowNewChatModal(false)}
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={styles.userChatWindow}>
      <ChatWindow chat={selectedChat} onClose={handleCloseChat} />
    </div>
  );
};

export default UserChat;