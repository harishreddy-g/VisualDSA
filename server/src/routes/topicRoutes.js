import express from 'express';
import { createTopic, deleteTopic, getTopics, updateTopic } from '../controllers/topicController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.get('/', getTopics);
router.post('/', protect, createTopic);
router.put('/:id', protect, updateTopic);
router.delete('/:id', protect, deleteTopic);

export default router;
