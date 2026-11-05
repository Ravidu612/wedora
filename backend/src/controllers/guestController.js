import Guest from '../models/Guest.js';
import SeatingTable from '../models/SeatingTable.js';

// @desc Add a new guest
// @route POST /api/weddings/:id/guests
export const createGuest = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      email,
      category = 'Relatives',
      group = 'Family & Friends',
      invitationStatus = 'Not Sent',
      rsvpStatus = 'Pending',
      attendeesCount = 1,
      hasPlusOne = false,
      plusOneName = '',
      childrenCount = 0,
      dietaryPreferences = 'Standard / Non-Veg',
      specialNotes = '',
      table,
    } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Guest name is required.' });
    }

    const guest = await Guest.create({
      wedding: req.params.id,
      name,
      phone,
      email,
      category,
      group,
      invitationStatus,
      rsvpStatus,
      attendeesCount: Math.max(1, Number(attendeesCount) || 1),
      hasPlusOne,
      plusOneName,
      childrenCount: Math.max(0, Number(childrenCount) || 0),
      dietaryPreferences,
      specialNotes,
      table,
    });

    if (table) {
      await SeatingTable.findByIdAndUpdate(table, {
        $addToSet: { assignedGuests: guest._id },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Guest added successfully.',
      guest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all guests with filters and search
// @route GET /api/weddings/:id/guests
export const getGuests = async (req, res, next) => {
  try {
    const { search, category, rsvpStatus, dietaryPreferences } = req.query;

    const query = { wedding: req.params.id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (rsvpStatus && rsvpStatus !== 'All') {
      query.rsvpStatus = rsvpStatus;
    }

    if (dietaryPreferences && dietaryPreferences !== 'All') {
      query.dietaryPreferences = dietaryPreferences;
    }

    const guests = await Guest.find(query)
      .sort({ name: 1 })
      .populate('table', 'tableNumber tableName');

    res.status(200).json({
      success: true,
      count: guests.length,
      guests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update guest
// @route PUT /api/weddings/:id/guests/:guestId
export const updateGuest = async (req, res, next) => {
  try {
    const guest = await Guest.findOne({
      _id: req.params.guestId,
      wedding: req.params.id,
    });

    if (!guest) {
      return res.status(404).json({ success: false, message: 'Guest not found.' });
    }

    const previousTable = guest.table;
    const newTable = req.body.table;

    Object.assign(guest, req.body);
    await guest.save();

    // Handle table assignment changes
    if (previousTable && previousTable.toString() !== (newTable || '').toString()) {
      await SeatingTable.findByIdAndUpdate(previousTable, {
        $pull: { assignedGuests: guest._id },
      });
    }
    if (newTable && newTable.toString() !== (previousTable || '').toString()) {
      await SeatingTable.findByIdAndUpdate(newTable, {
        $addToSet: { assignedGuests: guest._id },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Guest updated successfully.',
      guest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete guest
// @route DELETE /api/weddings/:id/guests/:guestId
export const deleteGuest = async (req, res, next) => {
  try {
    const guest = await Guest.findOneAndDelete({
      _id: req.params.guestId,
      wedding: req.params.id,
    });

    if (!guest) {
      return res.status(404).json({ success: false, message: 'Guest not found.' });
    }

    if (guest.table) {
      await SeatingTable.findByIdAndUpdate(guest.table, {
        $pull: { assignedGuests: guest._id },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Guest removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Bulk import guests (from CSV parser)
// @route POST /api/weddings/:id/guests/bulk
export const bulkUploadGuests = async (req, res, next) => {
  try {
    const { guests = [] } = req.body;
    if (!Array.isArray(guests) || guests.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or empty guests list.' });
    }

    const formattedGuests = guests.map(g => ({
      wedding: req.params.id,
      name: g.name || 'Unnamed Guest',
      phone: g.phone || '',
      email: g.email || '',
      category: g.category || 'Relatives',
      group: g.group || 'Family & Friends',
      rsvpStatus: g.rsvpStatus || 'Pending',
      attendeesCount: Math.max(1, Number(g.attendeesCount) || 1),
      dietaryPreferences: g.dietaryPreferences || 'Standard / Non-Veg',
      specialNotes: g.notes || g.specialNotes || '',
    }));

    const inserted = await Guest.insertMany(formattedGuests);

    res.status(201).json({
      success: true,
      message: `Successfully imported ${inserted.length} guests.`,
      count: inserted.length,
      guests: inserted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get guest and RSVP stats
// @route GET /api/weddings/:id/guests/stats
export const getGuestStats = async (req, res, next) => {
  try {
    const guests = await Guest.find({ wedding: req.params.id });

    let totalGuests = guests.length;
    let confirmedGuests = 0;
    let declinedGuests = 0;
    let pendingRSVP = 0;
    let expectedAttendees = 0;
    let brideSideCount = 0;
    let groomSideCount = 0;

    const dietaryBreakdown = {};

    for (const g of guests) {
      const attendees = g.attendeesCount || 1;

      if (g.rsvpStatus === 'Accepted') {
        confirmedGuests += 1;
        expectedAttendees += attendees;
      } else if (g.rsvpStatus === 'Declined') {
        declinedGuests += 1;
      } else {
        pendingRSVP += 1;
      }

      if (g.category === 'Bride Family' || g.category === 'Bride Friends') {
        brideSideCount += attendees;
      } else if (g.category === 'Groom Family' || g.category === 'Groom Friends') {
        groomSideCount += attendees;
      }

      const diet = g.dietaryPreferences || 'Standard / Non-Veg';
      dietaryBreakdown[diet] = (dietaryBreakdown[diet] || 0) + attendees;
    }

    res.status(200).json({
      success: true,
      stats: {
        totalGuests,
        confirmedGuests,
        declinedGuests,
        pendingRSVP,
        expectedAttendees,
        brideSideCount,
        groomSideCount,
        dietaryBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

