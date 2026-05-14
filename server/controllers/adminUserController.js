import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });
    res.json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Ошибка при получении пользователей' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Ошибка при получении пользователя' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    if (role === 'user' && user.role === 'admin') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount === 1) {
        return res.status(400).json({ error: 'Нельзя снять права администратора с единственного администратора' });
      }
    }
    
    if (name) user.name = name;
    if (email) {
      const existingUser = await User.findOne({ where: { email, id: { [Op.ne]: id } } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email уже используется другим пользователем' });
      }
      user.email = email;
    }
    if (role) user.role = role;
    
    await user.save();
    
    res.json({
      message: 'Данные пользователя обновлены',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении пользователя' });
  }
};

export const changeUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    
    console.log('Changing password for user:', id); // Для отладки
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Пароль должен содержать минимум 6 символов' });
    }
    
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!specialCharRegex.test(newPassword)) {
      return res.status(400).json({ error: 'Пароль должен содержать хотя бы один специальный символ' });
    }
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await user.update({ password: hashedPassword }, { hooks: false });
    
    console.log('Password changed successfully for user:', user.email);
    
    res.json({ message: 'Пароль успешно изменен' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Ошибка при смене пароля' });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'Нельзя заблокировать самого себя' });
    }
    
    if (user.role === 'admin') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount === 1) {
        return res.status(400).json({ error: 'Нельзя заблокировать единственного администратора' });
      }
    }
    
    user.isBlocked = isBlocked;
    await user.save();
    
    res.json({
      message: isBlocked ? 'Пользователь заблокирован' : 'Пользователь разблокирован',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    console.error('Toggle block error:', error);
    res.status(500).json({ error: 'Ошибка при изменении статуса блокировки' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'Нельзя удалить самого себя' });
    }
    
    if (user.role === 'admin') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount === 1) {
        return res.status(400).json({ error: 'Нельзя удалить единственного администратора' });
      }
    }
    
    await user.destroy();
    
    res.json({ message: 'Пользователь удален' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Ошибка при удалении пользователя' });
  }
};