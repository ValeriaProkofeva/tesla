import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  changeUserPassword,
  toggleBlockUser,
  deleteUser,
} from '../controllers/adminUserController.js';
import { authMiddleware, adminMiddleware, verifyAdminPassword } from '../middleware/auth.js';

const router = express.Router();

// Все маршруты требуют авторизации и прав администратора
router.use(authMiddleware, adminMiddleware);

// Получение списка пользователей
router.get('/', getAllUsers);

// Получение пользователя по ID
router.get('/:id', getUserById);

// Обновление данных пользователя (требует пароль админа)
router.put('/:id', verifyAdminPassword, updateUser);

// Смена пароля пользователя (требует пароль админа)
router.put('/:id/password', verifyAdminPassword, changeUserPassword);

// Блокировка/разблокировка пользователя (требует пароль админа)
router.patch('/:id/block', verifyAdminPassword, toggleBlockUser);

// Удаление пользователя (требует пароль админа)
router.delete('/:id', verifyAdminPassword, deleteUser);

export default router;