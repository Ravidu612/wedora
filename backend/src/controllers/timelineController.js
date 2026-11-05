import TimelineItem from '../models/TimelineItem.js';

// Default Sri Lankan Wedding day schedule template
const DEFAULT_TIMELINE = [
  { startTime: '06:00 AM', endTime: '08:30 AM', title: 'Bridal & Groom Dressing / Salon', location: 'Bridal Suite', responsiblePerson: 'Beautician & Dresser' },
  { startTime: '08:45 AM', endTime: '09:15 AM', title: 'Arrival at Venue & Welcome of Guests', location: 'Reception Porch', responsiblePerson: 'Parents & Best Man' },
  { startTime: '09:15 AM', endTime: '10:00 AM', title: 'Auspicious Poruwa Ceremony (Nekath)', location: 'Poruwa Stage', responsiblePerson: 'Astaka chanter & Drummers' },
  { startTime: '10:00 AM', endTime: '10:30 AM', title: 'Marriage Register Signing & Legal Blessings', location: 'Registry Desk', responsiblePerson: 'Registrar & Witnesses' },
  { startTime: '10:30 AM', endTime: '11:15 AM', title: 'Family & Bridal Party Photography Session', location: 'Garden & Ballroom', responsiblePerson: 'Official Photographer' },
  { startTime: '11:30 AM', endTime: '12:00 PM', title: 'Grand Entrance, Cake Cutting & Toast', location: 'Main Ballroom', responsiblePerson: 'Toastmaster / MC' },
  { startTime: '12:15 PM', endTime: '01:45 PM', title: 'Buffet Wedding Lunch Served', location: 'Dining Hall', responsiblePerson: 'Catering Captain' },
  { startTime: '01:45 PM', endTime: '03:15 PM', title: 'Live Music, Traditional Baila & Dancing', location: 'Dance Floor', responsiblePerson: 'Band / DJ' },
  { startTime: '03:30 PM', endTime: '04:00 PM', title: 'Going Away / Couple Send-Off', location: 'Grand Exit', responsiblePerson: 'Bridesmaids & Groomsmen' },
];

// @desc Get all timeline items (auto-seeds if empty)
// @route GET /api/weddings/:id/timeline
export const getTimelineItems = async (req, res, next) => {
  try {
    let items = await TimelineItem.find({ wedding: req.params.id }).sort({ order: 1, startTime: 1 });

    if (items.length === 0) {
      const seeded = DEFAULT_TIMELINE.map((item, index) => ({
        ...item,
        wedding: req.params.id,
        order: index + 1,
      }));
      items = await TimelineItem.insertMany(seeded);
    }

    res.status(200).json({
      success: true,
      count: items.length,
      timeline: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Add timeline item
// @route POST /api/weddings/:id/timeline
export const createTimelineItem = async (req, res, next) => {
  try {
    const { title, startTime, endTime, location, responsiblePerson, notes, order } = req.body;

    if (!title || !startTime) {
      return res.status(400).json({ success: false, message: 'Title and start time are required.' });
    }

    const item = await TimelineItem.create({
      wedding: req.params.id,
      title,
      startTime,
      endTime: endTime || startTime,
      location: location || 'Main Ballroom',
      responsiblePerson: responsiblePerson || 'Wedding Coordinator',
      notes: notes || '',
      order: Number(order) || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Timeline event added.',
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update timeline item
// @route PUT /api/weddings/:id/timeline/:itemId
export const updateTimelineItem = async (req, res, next) => {
  try {
    const item = await TimelineItem.findOneAndUpdate(
      { _id: req.params.itemId, wedding: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Timeline item not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Timeline item updated.',
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete timeline item
// @route DELETE /api/weddings/:id/timeline/:itemId
export const deleteTimelineItem = async (req, res, next) => {
  try {
    const item = await TimelineItem.findOneAndDelete({
      _id: req.params.itemId,
      wedding: req.params.id,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Timeline item not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Timeline item removed.',
    });
  } catch (error) {
    next(error);
  }
};

