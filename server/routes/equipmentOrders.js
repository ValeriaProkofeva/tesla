import express from 'express';
import {
  createEquipmentOrder,
  getUserEquipmentOrders,
  getAllEquipmentOrders,
  updateEquipmentOrder,
  deleteEquipmentOrder,
} from '../controllers/equipmentOrderController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, createEquipmentOrder);
router.get('/my', authMiddleware, getUserEquipmentOrders);
router.get('/all', authMiddleware, adminMiddleware, getAllEquipmentOrders);
router.put('/:id', authMiddleware, adminMiddleware, updateEquipmentOrder);
router.delete('/:id', authMiddleware, adminMiddleware, deleteEquipmentOrder);

export default router;