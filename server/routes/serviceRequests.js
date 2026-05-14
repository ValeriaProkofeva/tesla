import express from 'express';
import {
  createServiceRequest,
  getUserServiceRequests,
  getAllServiceRequests,
  updateServiceRequest,
  deleteServiceRequest,
} from '../controllers/serviceRequestController.js';
import { authMiddleware, adminMiddleware, canManageRequests  } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, createServiceRequest);
router.get('/my', authMiddleware, getUserServiceRequests);
router.get('/all', authMiddleware, canManageRequests, getAllServiceRequests);
router.put('/:id', authMiddleware, canManageRequests, updateServiceRequest);
router.delete('/:id', authMiddleware, adminMiddleware, deleteServiceRequest);

export default router;