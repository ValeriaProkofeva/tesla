import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      throw new Error();
    }

    if (user.isBlocked) {
      return res.status(403).json({ error: 'Ваш аккаунт заблокирован. Обратитесь к администратору.' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Пожалуйста, авторизуйтесь' });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Доступ запрещен. Требуются права администратора' });
  }
};

export const managerMiddleware = (req, res, next) => {
  if (req.user && (req.user.role === 'manager' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ error: 'Доступ запрещен. Требуются права менеджера' });
  }
};

export const canManageRequests = (req, res, next) => {
  if (req.user && (req.user.role === 'manager' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ error: 'Доступ запрещен' });
  }
};

export const verifyAdminPassword = async (req, res, next) => {
  try {
    const { adminPassword } = req.body;
    const admin = req.user;

    if (!adminPassword) {
      return res.status(400).json({ error: 'Требуется пароль администратора' });
    }

    const isPasswordValid = await admin.comparePassword(adminPassword);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Неверный пароль администратора' });
    }

    next();
  } catch (error) {
    console.error('Verify admin password error:', error);
    res.status(500).json({ error: 'Ошибка при проверке пароля' });
  }
};

export { JWT_SECRET };