import Invitation from '../models/Invitation.js';
import Wedding from '../models/Wedding.js';
import Guest from '../models/Guest.js';
import crypto from 'crypto';

// @desc Get or create invitation configuration for wedding
// @route GET /api/weddings/:id/invitations
export const getInvitation = async (req, res, next) => {
  try {
    let invitation = await Invitation.findOne({ wedding: req.params.id });

    if (!invitation) {
      const wedding = await Wedding.findById(req.params.id);
      if (!wedding) {
        return res.status(404).json({ success: false, message: 'Wedding not found.' });
      }

      // Generate a clean slug
      const slug = `${wedding.brideName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${wedding.groomName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${crypto.randomBytes(3).toString('hex')}`;

      invitation = await Invitation.create({
        wedding: wedding._id,
        slug,
        brideName: wedding.brideName,
        groomName: wedding.groomName,
        weddingDate: wedding.weddingDate,
        venue: wedding.venue,
        location: wedding.location,
        schedule: [
          { time: '09:15 AM', title: 'Auspicious Poruwa Ceremony', description: 'Traditional Sri Lankan blessings & rituals' },
          { time: '11:00 AM', title: 'Grand Toast & Cake Cutting', description: 'Celebration with closest family & friends' },
          { time: '12:30 PM', title: 'Festive Wedding Banquet', description: 'Curated Sri Lankan & international cuisine' },
          { time: '02:00 PM', title: 'Music & Traditional Baila / Dance', description: 'Celebration and farewell' },
        ],
      });
    }

    res.status(200).json({
      success: true,
      invitation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update invitation details
// @route PUT /api/weddings/:id/invitations
export const updateInvitation = async (req, res, next) => {
  try {
    const invitation = await Invitation.findOneAndUpdate(
      { wedding: req.params.id },
      { $set: req.body },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Invitation updated successfully.',
      invitation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Public: Get invitation by slug
// @route GET /api/invitations/public/:slug
export const getPublicInvitationBySlug = async (req, res, next) => {
  try {
    const invitation = await Invitation.findOne({
      slug: req.params.slug,
      isPublic: true,
    });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found or has been made private.',
      });
    }

    // Increment view count
    invitation.viewsCount = (invitation.viewsCount || 0) + 1;
    await invitation.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      invitation: {
        _id: invitation._id,
        wedding: invitation.wedding,
        slug: invitation.slug,
        template: invitation.template,
        title: invitation.title,
        customMessage: invitation.customMessage,
        brideName: invitation.brideName,
        groomName: invitation.groomName,
        weddingDate: invitation.weddingDate,
        venue: invitation.venue,
        location: invitation.location,
        dressCode: invitation.dressCode,
        accentColor: invitation.accentColor,
        fontFamily: invitation.fontFamily,
        backgroundPattern: invitation.backgroundPattern,
        schedule: invitation.schedule,
        isRSVPEnabled: invitation.isRSVPEnabled,
        rsvpDeadline: invitation.rsvpDeadline,
        allowPlusOne: invitation.allowPlusOne,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Public: Submit RSVP from public invitation page
// @route POST /api/invitations/public/:slug/rsvp
export const submitPublicRSVP = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const {
      name,
      phone,
      email,
      rsvpStatus = 'Accepted',
      attendeesCount = 1,
      hasPlusOne = false,
      plusOneName = '',
      dietaryPreferences = 'Standard / Non-Veg',
      specialNotes = '',
    } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide your full name.' });
    }

    const invitation = await Invitation.findOne({ slug, isPublic: true });
    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Invitation not found.' });
    }

    if (!invitation.isRSVPEnabled) {
      return res.status(400).json({ success: false, message: 'RSVP is currently closed for this invitation.' });
    }

    // Check if guest already exists by phone or email for this wedding
    let guest = null;
    if (phone || email) {
      const matchCriteria = [{ name: new RegExp(`^${name}$`, 'i') }];
      if (phone) matchCriteria.push({ phone });
      if (email) matchCriteria.push({ email: email.toLowerCase() });

      guest = await Guest.findOne({
        wedding: invitation.wedding,
        $or: matchCriteria,
      });
    }

    if (guest) {
      guest.rsvpStatus = rsvpStatus;
      guest.attendeesCount = Math.max(1, Number(attendeesCount) || 1);
      guest.hasPlusOne = Boolean(hasPlusOne);
      guest.plusOneName = plusOneName;
      guest.dietaryPreferences = dietaryPreferences;
      guest.specialNotes = specialNotes;
      guest.invitationStatus = 'Delivered';
      await guest.save();
    } else {
      guest = await Guest.create({
        wedding: invitation.wedding,
        name,
        phone: phone || '',
        email: email ? email.toLowerCase() : '',
        category: 'Relatives',
        group: 'Public RSVP',
        rsvpStatus,
        attendeesCount: Math.max(1, Number(attendeesCount) || 1),
        hasPlusOne: Boolean(hasPlusOne),
        plusOneName,
        dietaryPreferences,
        specialNotes,
        invitationStatus: 'Delivered',
      });
    }

    res.status(200).json({
      success: true,
      message: rsvpStatus === 'Accepted'
        ? `Thank you, ${name}! Your RSVP has been confirmed. We cannot wait to celebrate with you!`
        : `Thank you, ${name}. We have recorded your response. We will miss you!`,
      guest,
    });
  } catch (error) {
    next(error);
  }
};

