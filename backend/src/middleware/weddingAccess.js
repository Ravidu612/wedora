import Wedding from '../models/Wedding.js';
import WeddingMember from '../models/WeddingMember.js';

export const checkWeddingAccess = async (req, res, next) => {
  try {
    const weddingId = req.params.id || req.params.weddingId || req.body.weddingId;

    if (!weddingId) {
      return res.status(400).json({
        success: false,
        message: 'Wedding ID is required to verify access.',
      });
    }

    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res.status(404).json({
        success: false,
        message: 'Wedding workspace not found.',
      });
    }

    // Check if user is the wedding creator/owner
    if (wedding.owner.toString() === req.user._id.toString()) {
      req.wedding = wedding;
      req.userRole = 'owner';
      return next();
    }

    // Check if user is an accepted member/collaborator
    const membership = await WeddingMember.findOne({
      wedding: weddingId,
      user: req.user._id,
      status: 'accepted',
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to access this wedding workspace.',
      });
    }

    req.wedding = wedding;
    req.membership = membership;
    req.userRole = membership.role;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to authorize wedding access.',
      error: error.message,
    });
  }
};

