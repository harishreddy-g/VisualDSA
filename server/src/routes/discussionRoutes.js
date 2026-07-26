import express from 'express';
import {
  getDiscussions,
  postDiscussion,
  likeDiscussion,
  deleteDiscussion,
} from '../controllers/discussionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });  // gets :slug from parent

router.get('/', getDiscussions);
router.post('/', protect, postDiscussion);
router.post('/:id/like', protect, likeDiscussion);
router.delete('/:id', protect, deleteDiscussion);

export default router;
