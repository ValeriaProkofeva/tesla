import React, { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import ChatList from '../Chat/ChatList';
import ChatWindow from '../Chat/ChatWindow';
import BroadcastModal from '../Modals/BroadcastModal';
import styles from './ManagerPanel.module.css';

const ManagerChat = () => {
  const { user } = useAuth();
  const { 
    activeChats, 
    setCurrentRoom, 
    currentRoom, 
    totalUnread, 
    getUsersForChat,
    openChat,
    fetchChats 
  } = useChat();
  
  const [selectedChat, setSelectedChat] = useState(null);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [users, setUsers] = useState([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
    loadChats();
  }, []);

  const loadUsers = async () => {
    const usersList = await getUsersForChat();
    setUsers(usersList);
  };

  const loadChats = async () => {
    await fetchChats();
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setCurrentRoom(chat);
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
    setCurrentRoom(null);
  };

  const handleStartNewChat = async (userId, userName) => {
    setLoading(true);
    const roomId = await openChat(userId, userName);
    if (roomId) {
      await loadChats();
      const existingChat = activeChats.find(chat => 
        (chat.user?.id === userId || chat.manager?.id === userId)
      );
      if (existingChat) {
        handleSelectChat(existingChat);
      }
      setShowNewChatModal(false);
      setSearchTerm('');
    }
    setLoading(false);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.managerChatContainer}>
      <div className={styles.managerChatWrapper}>
        <div className={styles.chatSidebar}>
          <div className={styles.chatSidebarHeader}>
            <h3>Чаты с клиентами</h3>
            {totalUnread() > 0 && (
              <div className={styles.totalUnreadBadge}>{totalUnread()}</div>
            )}
          </div>
          
          <div className={styles.chatActions}>
            <button 
              className={styles.newChatButton}
              onClick={() => setShowNewChatModal(true)}
            >
              Новый диалог
            </button>
            <button 
              className={styles.broadcastButton}
              onClick={() => setShowBroadcast(true)}
            >
              Массовая рассылка
            </button>
          </div>
          
          <ChatList 
            onSelectChat={handleSelectChat} 
            selectedChatId={selectedChat?.id}
          />
        </div>
        
        <div className={styles.chatMain}>
          {selectedChat ? (
            <ChatWindow chat={selectedChat} onClose={handleCloseChat} />
          ) : (
            <div className={styles.noChatSelected}>
              <p>Выберите чат из списка слева</p>
              <p className={styles.noChatHint}>Или начните новый диалог с клиентом</p>
            </div>
          )}
        </div>
      </div>
      
      {showNewChatModal && (
        <div className={styles.modalOverlay} onClick={() => setShowNewChatModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Новый диалог</h3>
              <button className={styles.modalClose} onClick={() => setShowNewChatModal(false)}>×</button>
            </div>
            
            <div className={styles.modalBody}>
              <input
                type="text"
                placeholder="Поиск по имени или email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              
              <div className={styles.usersList}>
                {loading ? (
                  <div className={styles.loading}>Загрузка...</div>
                ) : filteredUsers.length === 0 ? (
                  <div className={styles.noUsers}>
                    {searchTerm ? 'Ничего не найдено' : 'Нет пользователей'}
                  </div>
                ) : (
                  filteredUsers.map(user => (
                    <div
                      key={user.id}
                      className={styles.userItem}
                      onClick={() => handleStartNewChat(user.id, user.name)}
                    >
                      <div className={styles.userAvatar}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.userInfo}>
                        <div className={styles.userName}>{user.name}</div>
                        <div className={styles.userEmail}>{user.email}</div>
                      </div>
                      <button className={styles.startChatBtn}>Написать</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <BroadcastModal
        isOpen={showBroadcast}
        onClose={() => setShowBroadcast(false)}
        users={users}
      />
    </div>
  );
};

export default ManagerChat;