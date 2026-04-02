import React, { useState, useEffect } from 'react';
import styles from './Toast.module.css';

const Toast = ({ message, type, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  // Функция для форматирования сообщения (поддержка жирного текста)
  const formatMessage = (text) => {
    if (typeof text !== 'string') return text;
    
    // Разбиваем на части, если есть **текст**
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`${styles.toast} ${styles[type]} ${isLeaving ? styles.slideOut : ''}`}>
      <div className={styles.content}>
        <div className={styles.icon}>
          {type === 'success' && '✓'}
          {type === 'error' && '!'}
          {type === 'info' && 'i'}
          {type === 'warning' && '⚠'}
        </div>
        <div className={styles.message}>
          {formatMessage(message)}
        </div>
        <button 
          className={styles.closeBtn} 
          onClick={() => {
            setIsLeaving(true);
            setTimeout(() => {
              setIsVisible(false);
              if (onClose) onClose();
            }, 300);
          }}
        >
          ×
        </button>
      </div>
      <div 
        className={styles.progressBar} 
        style={{ 
          animationDuration: `${duration}ms`,
          background: `linear-gradient(90deg, ${getProgressColor(type)} 0%, ${getProgressColor(type, 0.7)} 100%)`
        }} 
      />
    </div>
  );
};

// Функция для получения цвета прогресс-бара
const getProgressColor = (type, opacity = 1) => {
  const colors = {
    success: `rgba(76, 175, 80, ${opacity})`,
    error: `rgba(244, 67, 54, ${opacity})`,
    info: `rgba(74, 79, 185, ${opacity})`,
    warning: `rgba(255, 152, 0, ${opacity})`,
  };
  return colors[type] || `rgba(74, 79, 185, ${opacity})`;
};

export default Toast;