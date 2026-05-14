import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import styles from './Chat.module.css';

const ChatWindow = ({ chat, onClose }) => {
  const { user } = useAuth();
  const { 
    messages, 
    sendMessage, 
    sendTyping,
    loadMessages,
    markAsRead,
    typingUsers,
    isUserOnline,
  } = useChat();
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isInitialMount = useRef(true); 

  const roomMessages = messages[chat.id] || [];
  
  const getOtherUserName = () => {
    if (user?.role === 'manager' || user?.role === 'admin') {
      return chat.user?.name || 'Пользователь';
    }
    return chat.manager?.name || 'Менеджер';
  };

  const getOtherUserId = () => {
    if (user?.role === 'manager' || user?.role === 'admin') {
      return chat.user?.id;
    }
    return chat.manager?.id;
  };

  useEffect(() => {
    if (chat.id) {
      loadMessages(chat.id);
      const unreadMessages = roomMessages.filter(m => m.senderId !== user?.id && !m.isRead);
      if (unreadMessages.length > 0) {
        markAsRead(chat.id, unreadMessages.map(m => m.id));
      }
    }
  }, [chat.id]);

  useEffect(() => {
     document.body.style.overflow = 'hidden';
  
  return () => {
    document.body.style.overflow = '';
  };
}, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    await sendMessage(chat.id, inputMessage, getOtherUserId());
    setInputMessage('');
    
    if (isTyping) {
      sendTyping(chat.id, false);
      setIsTyping(false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      sendTyping(chat.id, true);
    }
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTyping(chat.id, false);
    }, 2000);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const isTypingOther = typingUsers[getOtherUserId()];

  return (
    <div className={styles.chatWindow}>
      {/* Заголовок чата */}
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderInfo}>
          <div className={styles.chatHeaderAvatar}>
            {getOtherUserName().charAt(0).toUpperCase()}
            {isUserOnline(getOtherUserId()) && (
              <span className={styles.onlineIndicator} />
            )}
          </div>
          <div>
            <div className={styles.chatHeaderName}>{getOtherUserName()}</div>
            <div className={styles.chatHeaderStatus}>
              {isUserOnline(getOtherUserId()) ? 'В сети' : 'Не в сети'}
            </div>
          </div>
        </div>
        <button className={styles.closeChatBtn} onClick={onClose}>×</button>
      </div>

      {/* Сообщения */}
      <div className={styles.chatMessages}>
        {roomMessages.length === 0 ? (
          <div className={styles.emptyMessages}>
            <div className={styles.emptyMessagesIcon}>💬</div>
            <p>Напишите сообщение, чтобы начать диалог</p>
          </div>
        ) : (
          roomMessages.map((msg, index) => {
            const isOwn = msg.senderId === user?.id;
            const showAvatar = !isOwn && (index === 0 || roomMessages[index - 1]?.senderId !== msg.senderId);
            
            return (
              <div
                key={msg.id}
                className={`${styles.message} ${isOwn ? styles.ownMessage : styles.otherMessage}`}
              >
                {!isOwn && showAvatar && (
                  <div className={styles.messageAvatar}>
                    {getOtherUserName().charAt(0).toUpperCase()}
                  </div>
                )}
                <div className={styles.messageContent}>
                  <div className={styles.messageBubble}>
                    <div className={styles.messageText}>{msg.message}</div>
                    <div className={styles.messageTime}>
                      {formatTime(msg.createdAt)}
                      {isOwn && (
                        <span className={styles.messageStatus}>
                          {msg.isRead ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {isTypingOther && (
          <div className={styles.typingIndicator}>
            <div className={styles.typingDots}>
              <span>•</span><span>•</span><span>•</span>
            </div>
            <span>печатает...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <div className={styles.chatInput}>
        <textarea
          ref={inputRef}
          className={styles.messageInput}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          onInput={handleTyping}
          placeholder="Введите сообщение..."
          rows={1}
        />
        <button
          className={styles.sendButton}
          onClick={handleSendMessage}
          disabled={!inputMessage.trim()}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;