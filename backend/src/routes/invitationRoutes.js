import express from 'express';
import {
  getInvitation,
  updateInvitation,
  getPublicInvitationBySlug,
  submitPublicRSVP,
} from '../controllers/invitationController.js';
import { protect } from '../middleware/auth.js';
import { checkWeddingAccess } from '../middleware/weddingAccess.js';

const router = express.Router({ mergeParams: true });

// Public endpoints
router.get('/public/:slug', getPublicInvitationBySlug);
router.post('/public/:slug/rsvp', submitPublicRSVP);

// Protected workspace endpoints
router.get('/:id/invitations', protect, checkWeddingAccess, getInvitation);
router.put('/:id/invitations', protect, checkWeddingAccess, updateInvitation);

export default router;

