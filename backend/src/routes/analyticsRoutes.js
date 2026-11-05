import express from 'express';
import {
  getDashboardAnalytics,
  getCateringEstimateAPI,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';
import { checkWeddingAccess } from '../middleware/weddingAccess.js';

const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(checkWeddingAccess);

router.get('/', getDashboardAnalytics);
router.post('/catering-estimate', getCateringEstimateAPI);

export default router;

