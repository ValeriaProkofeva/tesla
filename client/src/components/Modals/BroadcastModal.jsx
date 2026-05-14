import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useToast } from '../context/ToastContext';
import styles from './Modal.module.css';

const BroadcastModal = ({ isOpen, onClose, users }) => {
  const { sendBroadcast } = useChat();
  const { success, error: showError } = useToast();
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      showError('Введите текст сообщения');
      return;
    }
    
    setSending(true);
    
    const result = await sendBroadcast(
      message,
      recipientType,
      recipientType === 'custom' ? selectedUsers : []
    );
    
    setSending(false);
    
    if (result) {
      onClose();
      setMessage('');
      setSelectedUsers([]);
    }
  };

  const handleUserToggle = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2 className={styles.modalTitle}> Массовая рассылка</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Кому отправить</label>
            <select
              value={recipientType}
              onChange={(e) => setRecipientType(e.target.value)}
              className={styles.select}
            >
              <option value="all">Всем пользователям</option>
              <option value="with_requests">Пользователям с заявками</option>
              <option value="custom">Выбрать вручную</option>
            </select>
          </div>
          
          {recipientType === 'custom' && (
            <div className={styles.formGroup}>
              <label>Выберите получателей</label>
              <div className={styles.userSelectList}>
                {users.map(user => (
                  <label key={user.id} className={styles.userCheckbox}>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserToggle(user.id)}
                    />
                    <span>{user.name}</span>
                    <small>({user.email})</small>
                  </label>
                ))}
                {users.length === 0 && (
                  <div className={styles.noUsers}>Нет пользователей</div>
                )}
              </div>
            </div>
          )}
          
          <div className={styles.formGroup}>
            <label>Текст сообщения</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className={styles.textarea}
              placeholder="Введите текст сообщения..."
              required
            />
          </div>
          
          <div className={styles.formButtons}>
            <button type="submit" className={styles.submitButton} disabled={sending}>
              {sending ? 'Отправка...' : 'Отправить рассылку'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BroadcastModal;