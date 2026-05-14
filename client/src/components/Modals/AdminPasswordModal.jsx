import React, { useState } from 'react';
import PasswordInput from '../Common/PasswordInput';
import styles from './Modal.module.css';

const AdminPasswordModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Введите пароль администратора');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await onConfirm(password);
      setPassword('');
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Неверный пароль';
      setError(errorMessage);
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    setLoading(false);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose}>×</button>
        <h2 className={styles.modalTitle}>{title || 'Подтверждение действия'}</h2>
        <p className={styles.modalMessage}>{message || 'Для выполнения этого действия введите пароль администратора'}</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <PasswordInput
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="Введите ваш пароль"
            label="Пароль администратора"
            error={error}
            autoFocus
          />
          
          <div className={styles.formButtons}>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Проверка...' : 'Подтвердить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPasswordModal;