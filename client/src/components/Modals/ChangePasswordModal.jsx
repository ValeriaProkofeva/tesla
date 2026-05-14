import React, { useState } from 'react';
import PasswordInput from '../Common/PasswordInput';
import styles from './Modal.module.css';

const ChangePasswordModal = ({ isOpen, onClose, onConfirm, userName }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    
    if (!newPassword) {
      newErrors.newPassword = 'Введите новый пароль';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Пароль должен содержать минимум 6 символов';
    }
    
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!specialCharRegex.test(newPassword)) {
      newErrors.newPassword = 'Пароль должен содержать специальный символ (!@#$%^&* и т.д.)';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await onConfirm(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (error) {
      // Ошибка уже обработана в onConfirm
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2 className={styles.modalTitle}>Смена пароля</h2>
        <p className={styles.modalMessage}>
          Введите новый пароль для пользователя <strong>{userName}</strong>
        </p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <PasswordInput
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
            }}
            placeholder="Введите новый пароль"
            label="Новый пароль (мин. 6 символов + спецсимвол)"
            error={errors.newPassword}
            autoFocus
          />
          
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
            }}
            placeholder="Повторите пароль"
            label="Подтверждение пароля"
            error={errors.confirmPassword}
          />
          
          <div className={styles.formButtons}>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Сохранение...' : 'Сохранить пароль'}
            </button>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;