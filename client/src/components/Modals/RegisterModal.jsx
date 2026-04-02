import React, { useState } from 'react';
import styles from './Modal.module.css';
import { useAuth } from '../context/AuthContext';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const { register } = useAuth();

  if (!isOpen) return null;

  // Проверка наличия специального символа
  const hasSpecialChar = (password) => {
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    return specialChars.test(password);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Имя обязательно';
    else if (formData.name.length < 2) newErrors.name = 'Имя должно содержать минимум 2 символа';
    else if (formData.name.length > 30) newErrors.name = 'Имя не должно превышать 30 символов';
    
    if (!formData.email) newErrors.email = 'Email обязателен';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email неверный';
    else if (formData.email.length > 40) newErrors.email = 'Email не должен превышать 40 символов';
    
    if (!formData.password) newErrors.password = 'Пароль обязателен';
    else if (formData.password.length < 6) newErrors.password = 'Пароль должен содержать минимум 6 символов';
    else if (!hasSpecialChar(formData.password)) newErrors.password = 'Пароль должен содержать специальный символ (!@#$%^&*()_+)';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Подтвердите пароль';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');
    const result = await register(formData);
    
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
        <h2 className={styles.modalTitle}>Регистрация</h2>
        
        {apiError && <div className={styles.errorMessage}>{apiError}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Имя (2-30 символов)</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? styles.error : ''}
              placeholder="Иванов Иван"
              maxLength={30}
            />
            {errors.name && <div className={styles.errorText}>{errors.name}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label>Email (до 40 символов)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.error : ''}
              placeholder="example@mail.ru"
              maxLength={40}
            />
            {errors.email && <div className={styles.errorText}>{errors.email}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label>Пароль (мин. 6 символов + спецсимвол)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? styles.error : ''}
              placeholder="минимум 6 символов + !@#$%"
            />
            {errors.password && <div className={styles.errorText}>{errors.password}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label>Подтверждение пароля</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? styles.error : ''}
              placeholder="повторите пароль"
            />
            {errors.confirmPassword && <div className={styles.errorText}>{errors.confirmPassword}</div>}
          </div>
          
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        
        <div className={styles.switchText}>
          Уже есть аккаунт?
          <span className={styles.switchLink} onClick={onSwitchToLogin}>
            Войти
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;