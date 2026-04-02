import React, { useState } from 'react';
import styles from './Modal.module.css';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const { login } = useAuth();

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email обязателен';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email неверный';
    if (!password) newErrors.password = 'Пароль обязателен';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');
    const result = await login(email, password);
    
    if (result.success) {
      onClose();
    } else {
      setApiError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2 className={styles.modalTitle}>Вход</h2>
        
        {apiError && <div className={styles.errorMessage}>{apiError}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? styles.error : ''}
              placeholder="example@mail.ru"
            />
            {errors.email && <div className={styles.errorText}>{errors.email}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? styles.error : ''}
              placeholder="••••••"
            />
            {errors.password && <div className={styles.errorText}>{errors.password}</div>}
          </div>
          
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        
        <div className={styles.switchText}>
          Нет аккаунта?
          <span className={styles.switchLink} onClick={onSwitchToRegister}>
            Зарегистрироваться
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;