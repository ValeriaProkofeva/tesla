import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  axios.interceptors.request.use((config) => {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
  });

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]); 

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/api/auth/profile`);
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      if (error.response?.status === 403) {
        console.log('User is blocked');
      }
      logout();
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`/api/auth/register`, userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Ошибка регистрации' 
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`/api/auth/login`, { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data);
      console.error('Login error status:', error.response?.status);
      
      if (error.response?.status === 403) {
        return { 
          success: false, 
          error: error.response?.data?.error || 'Ваш аккаунт заблокирован. Обратитесь к администратору.' 
        };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.error || 'Ошибка входа. Проверьте email и пароль.' 
      };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(`/api/auth/profile`, profileData);
      setUser(response.data.user);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Update profile error:', error.response?.data);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Ошибка обновления' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};