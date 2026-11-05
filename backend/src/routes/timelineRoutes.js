import express from 'express';
import {
  getTimelineItems,
  createTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
} from '../controllers/timelineController.js';
import { protect } from '../middleware/auth.js';
import { checkWeddingAccess } from '../middleware/weddingAccess.js';

const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(checkWeddingAccess);

router.get('/', getTimelineItems);
router.post('/', createTimelineItem);
router.put('/:itemId', updateTimelineItem);
router.delete('/:itemId', deleteTimelineItem);

export default router;

