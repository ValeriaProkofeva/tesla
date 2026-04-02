import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../../components/Toast/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message, duration = 4000) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const error = useCallback((message, duration = 5000) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const info = useCallback((message, duration = 4000) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  const warning = useCallback((message, duration = 4500) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  const value = {
    showToast,
    success,
    error,
    info,
    warning,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toasts-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};