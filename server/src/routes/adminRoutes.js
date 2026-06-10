import express from 'express';
import { listUsers, updateUserRole } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.get('/users', protect, listUsers);
router.put('/users/:id', protect, updateUserRole);

export default router;
