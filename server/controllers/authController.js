import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { JWT_SECRET } from '../middleware/auth.js';
import { Op } from 'sequelize';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const hasSpecialChar = (password) => {
  const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  return specialChars.test(password);
};

export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Пароли не совпадают' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Пароль должен содержать минимум 6 символов' });
    }

    if (!hasSpecialChar(password)) {
      return res.status(400).json({ error: 'Пароль должен содержать хотя бы один специальный символ (!@#$%^&*()_+ и т.д.)' });
    }

    if (name.length > 30) {
      return res.status(400).json({ error: 'Имя не должно превышать 30 символов' });
    }

    if (email.length > 40) {
      return res.status(400).json({ error: 'Email не должен превышать 40 символов' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'Регистрация успешна',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Ошибка при регистрации' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Вход выполнен успешно',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Ошибка при входе' });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения профиля' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword, confirmNewPassword } = req.body;
    const user = req.user;

    if (name) {
      if (name.length > 30) {
        return res.status(400).json({ error: 'Имя не должно превышать 30 символов' });
      }
      user.name = name;
    }

    if (email && email !== user.email) {
      if (email.length > 40) {
        return res.status(400).json({ error: 'Email не должен превышать 40 символов' });
      }
      const existingUser = await User.findOne({ where: { email, id: { [Op.ne]: user.id } } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email уже используется другим пользователем' });
      }
      user.email = email;
    }

    if (currentPassword && newPassword) {
      const isPasswordValid = await user.comparePassword(currentPassword);
      
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Текущий пароль неверен' });
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ error: 'Новые пароли не совпадают' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Пароль должен содержать минимум 6 символов' });
      }

      if (!hasSpecialChar(newPassword)) {
        return res.status(400).json({ error: 'Пароль должен содержать хотя бы один специальный символ (!@#$%^&*()_+ и т.д.)' });
      }

      user.password = newPassword;
    }

    await user.save();

    res.json({
      message: 'Профиль успешно обновлен',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении профиля' });
  }
};

export const createAdminIfNotExists = async () => {
  try {
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    
    if (!adminExists) {
      await User.create({
        name: 'Администратор',
        email: 'admin@tesla.ru',
        password: 'Admin123!',
        role: 'admin',
      });
      console.log(' Администратор создан: admin@tesla.ru / Admin123!');
    } else {
      console.log(' Администратор уже существует');
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  }
};