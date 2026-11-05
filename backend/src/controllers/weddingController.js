import Wedding from '../models/Wedding.js';
import WeddingMember from '../models/WeddingMember.js';
import WeddingEvent from '../models/WeddingEvent.js';
import ExpenseCategory from '../models/ExpenseCategory.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

// Default categories to seed for new weddings
const DEFAULT_CATEGORIES = [
  { name: 'Venue & Reception Hall', allocatedBudget: 700000, side: 'Shared', icon: 'Building' },
  { name: 'Catering & Food', allocatedBudget: 500000, side: 'Shared', icon: 'Utensils' },
  { name: 'Photography & Videography', allocatedBudget: 350000, side: 'Shared', icon: 'Camera' },
  { name: 'Bridal Dressing & Saree/Gown', allocatedBudget: 300000, side: 'Bride', icon: 'Sparkles' },
  { name: 'Groom Dressing & Nilame / Suit', allocatedBudget: 150000, side: 'Groom', icon: 'Shirt' },
  { name: 'Jewellery & Rings', allocatedBudget: 300000, side: 'Shared', icon: 'Gem' },
  { name: 'Hair & Makeup Styling', allocatedBudget: 80000, side: 'Bride', icon: 'Smile' },
  { name: 'Decorations & Floral Design', allocatedBudget: 250000, side: 'Shared', icon: 'Flower' },
  { name: 'Poruwa Ceremony & Cultural Set', allocatedBudget: 100000, side: 'Shared', icon: 'Crown' },
  { name: 'Invitations & Stationery', allocatedBudget: 50000, side: 'Shared', icon: 'Mail' },
  { name: 'Wedding Cake & Structure', allocatedBudget: 60000, side: 'Shared', icon: 'Cake' },
  { name: 'Music, DJ & Traditional Drummers', allocatedBudget: 120000, side: 'Shared', icon: 'Music' },
  { name: 'Transportation & Wedding Car', allocatedBudget: 60000, side: 'Shared', icon: 'Car' },
  { name: 'Wedding Registration & Legal', allocatedBudget: 20000, side: 'Shared', icon: 'FileText' },
  { name: 'Gifts & Favours', allocatedBudget: 50000, side: 'Shared', icon: 'Gift' },
  { name: 'Homecoming Ceremony', allocatedBudget: 300000, side: 'Groom', icon: 'Home' },
  { name: 'Honeymoon Package', allocatedBudget: 250000, side: 'Shared', icon: 'Compass' },
  { name: 'Emergency Contingency', allocatedBudget: 100000, side: 'Shared', icon: 'ShieldAlert' },
  { name: 'Other Miscellaneous', allocatedBudget: 50000, side: 'Shared', icon: 'MoreHorizontal' },
];

// Predefined Sri Lankan & modern wedding checklist
const DEFAULT_TASKS = [
  // 12 Months Before
  { title: 'Define overall wedding budget and side contributions', timelineBucket: '12 Months Before', priority: 'High', assignedTo: 'Shared' },
  { title: 'Finalize wedding date and auspicious times (Nekath)', timelineBucket: '12 Months Before', priority: 'Urgent', assignedTo: 'Shared' },
  { title: 'Draft preliminary guest list count (Bride & Groom sides)', timelineBucket: '12 Months Before', priority: 'Medium', assignedTo: 'Shared' },
  { title: 'Shortlist and visit wedding reception venues / hotels', timelineBucket: '12 Months Before', priority: 'High', assignedTo: 'Shared' },
  { title: 'Book the wedding venue and pay initial deposit', timelineBucket: '12 Months Before', priority: 'Urgent', assignedTo: 'Shared' },

  // 9 Months Before
  { title: 'Book photographer and videographer', timelineBucket: '9 Months Before', priority: 'High', assignedTo: 'Shared' },
  { title: 'Select bridal salon and dress designer / Kandyan Osariya draper', timelineBucket: '9 Months Before', priority: 'High', assignedTo: 'Bride' },
  { title: 'Decide on wedding theme and primary color palette', timelineBucket: '9 Months Before', priority: 'Medium', assignedTo: 'Shared' },
  { title: 'Reserve Poruwa designer and traditional cultural team (Astaka, Drummers)', timelineBucket: '9 Months Before', priority: 'Medium', assignedTo: 'Shared' },

  // 6 Months Before
  { title: 'Finalize bridal attire, bridesmaids sarees, and jewellery', timelineBucket: '6 Months Before', priority: 'High', assignedTo: 'Bride' },
  { title: 'Select Groom suit or Mul Anduma (Nilame suit) and groomsmen outfits', timelineBucket: '6 Months Before', priority: 'High', assignedTo: 'Groom' },
  { title: 'Book floral decorator and hall lighting vendors', timelineBucket: '6 Months Before', priority: 'Medium', assignedTo: 'Shared' },
  { title: 'Book DJ / live acoustic band and Master of Ceremonies (MC)', timelineBucket: '6 Months Before', priority: 'Medium', assignedTo: 'Shared' },
  { title: 'Plan honeymoon destination, flights, and resort reservations', timelineBucket: '6 Months Before', priority: 'Medium', assignedTo: 'Shared' },

  // 3 Months Before
  { title: 'Order invitation cards and prepare digital invitations', timelineBucket: '3 Months Before', priority: 'High', assignedTo: 'Shared' },
  { title: 'Confirm wedding cake structure and giveaway cake boxes', timelineBucket: '3 Months Before', priority: 'Medium', assignedTo: 'Shared' },
  { title: 'Arrange bridal hair & makeup trial', timelineBucket: '3 Months Before', priority: 'Medium', assignedTo: 'Bride' },
  { title: 'Purchase wedding rings and ring cushions / trays', timelineBucket: '3 Months Before', priority: 'High', assignedTo: 'Shared' },

  // 1 Month Before
  { title: 'Send digital invitations and WhatsApp invitation links', timelineBucket: '1 Month Before', priority: 'Urgent', assignedTo: 'Shared' },
  { title: 'Track RSVPs and confirm final catering guest headcounts', timelineBucket: '1 Month Before', priority: 'Urgent', assignedTo: 'Shared' },
  { title: 'Finalize wedding day timeline and ceremony sequence with MC', timelineBucket: '1 Month Before', priority: 'High', assignedTo: 'Shared' },
  { title: 'Organize transport, bridal car, and family vans', timelineBucket: '1 Month Before', priority: 'Medium', assignedTo: 'Shared' },

  // 1 Week Before
  { title: 'Confirm final arrangements and call times with all vendors', timelineBucket: '1 Week Before', priority: 'Urgent', assignedTo: 'Shared' },
  { title: 'Prepare cash envelopes for on-the-day vendor balance payments', timelineBucket: '1 Week Before', priority: 'High', assignedTo: 'Shared' },
  { title: 'Pack emergency bridal kit (pins, makeup touch-up, pain relief)', timelineBucket: '1 Week Before', priority: 'Medium', assignedTo: 'Bride' },
  { title: 'Final dress fitting and shoe break-in', timelineBucket: '1 Week Before', priority: 'Medium', assignedTo: 'Bride' },

  // Wedding Day
  { title: 'Verify Poruwa setup and auspicious Nekath timing alignment', timelineBucket: 'Wedding Day', priority: 'Urgent', assignedTo: 'Shared' },
  { title: 'Sign legal marriage register with authorized witnesses', timelineBucket: 'Wedding Day', priority: 'Urgent', assignedTo: 'Shared' },
  { title: 'Celebrate and cherish every single moment!', timelineBucket: 'Wedding Day', priority: 'Urgent', assignedTo: 'Shared' },
];

// @desc Create a new wedding workspace
// @route POST /api/weddings
export const createWedding = async (req, res, next) => {
  try {
    const {
      brideName,
      groomName,
      weddingDate,
      homecomingDate,
      location,
      venue,
      weddingType,
      weddingTheme,
      estimatedGuestCount,
      totalBudget,
      brideSideBudget,
      groomSideBudget,
      sharedBudget,
      currency,
      notes,
    } = req.body;

    if (!brideName || !groomName || !weddingDate) {
      return res.status(400).json({
        success: false,
        message: 'Bride name, groom name, and wedding date are required.',
      });
    }

    const wedding = await Wedding.create({
      owner: req.user._id,
      brideName,
      groomName,
      weddingDate,
      homecomingDate,
      location: location || 'Colombo, Sri Lanka',
      venue: venue || '',
      weddingType: weddingType || 'Traditional Sri Lankan (Kandyan)',
      weddingTheme: weddingTheme || 'Champagne Gold & Ivory',
      estimatedGuestCount: estimatedGuestCount || 200,
      totalBudget: totalBudget || 2500000,
      brideSideBudget: brideSideBudget || 1000000,
      groomSideBudget: groomSideBudget || 1000000,
      sharedBudget: sharedBudget || 500000,
      currency: currency || req.user.preferredCurrency || 'LKR',
      notes: notes || '',
    });

    // Create owner membership
    await WeddingMember.create({
      wedding: wedding._id,
      user: req.user._id,
      role: 'owner',
      permissions: ['read', 'write', 'admin'],
      status: 'accepted',
    });

    // Create default ceremony events
    await WeddingEvent.create([
      {
        wedding: wedding._id,
        title: 'Poruwa Ceremony & Reception',
        eventType: 'Poruwa Ceremony',
        date: wedding.weddingDate,
        startTime: '09:00 AM',
        endTime: '03:00 PM',
        venue: wedding.venue || 'Grand Ballroom',
        location: wedding.location,
        order: 1,
      },
      ...(wedding.homecomingDate
        ? [
            {
              wedding: wedding._id,
              title: 'Homecoming Reception',
              eventType: 'Homecoming',
              date: wedding.homecomingDate,
              startTime: '06:30 PM',
              endTime: '11:30 PM',
              venue: 'Homecoming Banquet Hall',
              location: wedding.location,
              order: 2,
            },
          ]
        : []),
    ]);

    // Seed default expense categories
    const categoriesToInsert = DEFAULT_CATEGORIES.map(cat => ({
      ...cat,
      wedding: wedding._id,
      isDefault: true,
    }));
    await ExpenseCategory.insertMany(categoriesToInsert);

    // Seed predefined wedding tasks
    const tasksToInsert = DEFAULT_TASKS.map(task => ({
      ...task,
      wedding: wedding._id,
      isPredefined: true,
    }));
    await Task.insertMany(tasksToInsert);

    res.status(201).json({
      success: true,
      message: 'Wedding workspace initialized successfully.',
      wedding,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all weddings for current user
// @route GET /api/weddings
export const getMyWeddings = async (req, res, next) => {
  try {
    const memberships = await WeddingMember.find({
      user: req.user._id,
      status: 'accepted',
    }).populate('wedding');

    const weddings = memberships
      .map(m => m.wedding)
      .filter(w => w !== null);

    res.status(200).json({
      success: true,
      count: weddings.length,
      weddings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get wedding by ID with events & members
// @route GET /api/weddings/:id
export const getWeddingById = async (req, res, next) => {
  try {
    const wedding = await Wedding.findById(req.params.id);
    if (!wedding) {
      return res.status(404).json({ success: false, message: 'Wedding not found.' });
    }

    const events = await WeddingEvent.find({ wedding: wedding._id }).sort({ order: 1, date: 1 });
    const members = await WeddingMember.find({ wedding: wedding._id }).populate('user', 'name email phone avatar');

    res.status(200).json({
      success: true,
      wedding,
      events,
      members,
      currentUserRole: req.userRole || 'owner',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update wedding workspace
// @route PUT /api/weddings/:id
export const updateWedding = async (req, res, next) => {
  try {
    const wedding = await Wedding.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Wedding workspace updated successfully.',
      wedding,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete wedding workspace
// @route DELETE /api/weddings/:id
export const deleteWedding = async (req, res, next) => {
  try {
    if (req.userRole !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Only the wedding workspace owner can delete it.',
      });
    }

    await Wedding.findByIdAndDelete(req.params.id);
    await WeddingMember.deleteMany({ wedding: req.params.id });
    await WeddingEvent.deleteMany({ wedding: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Wedding workspace deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Invite collaborator / partner
// @route POST /api/weddings/:id/invite
export const invitePartner = async (req, res, next) => {
  try {
    const { email, role = 'partner' } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide partner email.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    const newMember = await WeddingMember.create({
      wedding: req.params.id,
      user: existingUser ? existingUser._id : req.user._id, // if user doesn't exist yet, link placeholder
      inviteEmail: email.toLowerCase(),
      role,
      invitedBy: req.user._id,
      status: existingUser ? 'accepted' : 'pending',
    });

    res.status(201).json({
      success: true,
      message: `Invitation registered for ${email}.`,
      member: newMember,
    });
  } catch (error) {
    next(error);
  }
};

