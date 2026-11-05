import express from 'express';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { checkWeddingAccess } from '../middleware/weddingAccess.js';

const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(checkWeddingAccess);

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

export default router;

