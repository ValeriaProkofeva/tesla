import express from 'express';
import {
  createConsultation,
  getUserConsultations,
  getAllConsultations,
  updateConsultationStatus,
  deleteConsultation,
} from '../controllers/consultationController.js';
import { authMiddleware, adminMiddleware, canManageRequests } from '../middleware/auth.js';

const router = express.Router();

// Создание заявки (только авторизованные)
router.post('/', authMiddleware, createConsultation);

// Получение своих заявок (авторизованные)
router.get('/my', authMiddleware, getUserConsultations);

// Получение всех заявок (только админ)
router.get('/all', authMiddleware, canManageRequests, getAllConsultations);

// Обновление статуса (только админ)
router.put('/:id', authMiddleware, canManageRequests, updateConsultationStatus);

// Удаление заявки (только админ)
router.delete('/:id', authMiddleware, adminMiddleware, deleteConsultation);

export default router;