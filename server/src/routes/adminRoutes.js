import express from 'express';
import { listUsers, updateUserRole } from '../controllers/adminController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
router.get('/users', protect, requireAdmin, listUsers);
router.put('/users/:id', protect, requireAdmin, updateUserRole);
router.put('/users/:id/role', protect, requireAdmin, updateUserRole);

export default router;
