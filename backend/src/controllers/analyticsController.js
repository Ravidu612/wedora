import Wedding from '../models/Wedding.js';
import Expense from '../models/Expense.js';
import Payment from '../models/Payment.js';
import Contribution from '../models/Contribution.js';
import Guest from '../models/Guest.js';
import Vendor from '../models/Vendor.js';
import Task from '../models/Task.js';
import { calculateWeddingFinancials, calculateCateringEstimate } from '../services/calculationService.js';

// @desc Get complete real-time dashboard analytics
// @route GET /api/weddings/:id/analytics
export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const wedding = await Wedding.findById(req.params.id);
    if (!wedding) {
      return res.status(404).json({ success: false, message: 'Wedding not found.' });
    }

    // Fetch real records in parallel
    const [expenses, payments, contributions, guests, vendors, tasks] = await Promise.all([
      Expense.find({ wedding: wedding._id, isDeleted: false }),
      Payment.find({ wedding: wedding._id, isDeleted: false }),
      Contribution.find({ wedding: wedding._id, isDeleted: false }),
      Guest.find({ wedding: wedding._id }),
      Vendor.find({ wedding: wedding._id }),
      Task.find({ wedding: wedding._id }),
    ]);

    // Pass real data into centralized financial calculation engine
    const financial = calculateWeddingFinancials({
      totalBudget: wedding.totalBudget,
      expenses,
      payments,
      contributions,
      weddingDate: wedding.weddingDate,
    });

    // Guest statistics
    let confirmedGuests = 0;
    let pendingGuests = 0;
    let declinedGuests = 0;
    let expectedAttendees = 0;

    for (const g of guests) {
      if (g.rsvpStatus === 'Accepted') {
        confirmedGuests += 1;
        expectedAttendees += (g.attendeesCount || 1);
      } else if (g.rsvpStatus === 'Declined') {
        declinedGuests += 1;
      } else {
        pendingGuests += 1;
      }
    }

    // Task statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const upcomingTasks = tasks
      .filter(t => t.status !== 'Completed')
      .slice(0, 5);

    // Vendor statistics
    const bookedVendors = vendors.filter(v => v.bookingStatus === 'Booked').length;
    const totalVendors = vendors.length;

    // Upcoming payment deadlines
    const upcomingExpenses = expenses
      .filter(e => e.paymentDeadline && e.paymentStatus !== 'Paid')
      .sort((a, b) => new Date(a.paymentDeadline) - new Date(b.paymentDeadline))
      .slice(0, 5);

    // Recent payment transactions
    const recentPayments = payments
      .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
      .slice(0, 5);

    res.status(200).json({
      success: true,
      wedding: {
        _id: wedding._id,
        brideName: wedding.brideName,
        groomName: wedding.groomName,
        weddingDate: wedding.weddingDate,
        homecomingDate: wedding.homecomingDate,
        venue: wedding.venue,
        location: wedding.location,
        currency: wedding.currency,
        totalBudget: wedding.totalBudget,
      },
      financial,
      guests: {
        total: guests.length,
        confirmed: confirmedGuests,
        pending: pendingGuests,
        declined: declinedGuests,
        expectedAttendees,
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        progressPercent: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        upcoming: upcomingTasks,
      },
      vendors: {
        total: totalVendors,
        booked: bookedVendors,
      },
      upcomingPayments: upcomingExpenses,
      recentTransactions: recentPayments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Smart catering cost estimator
// @route POST /api/weddings/:id/smart/catering
export const getCateringEstimateAPI = async (req, res, next) => {
  try {
    const {
      adultCount = 0,
      childCount = 0,
      adultPlateCost = 4500,
      childPlateCost = 2500,
      serviceChargePercent = 10,
      vatPercent = 0,
      additionalCharges = 0,
    } = req.body;

    const estimate = calculateCateringEstimate({
      adultCount,
      childCount,
      adultPlateCost,
      childPlateCost,
      serviceChargePercent,
      vatPercent,
      additionalCharges,
    });

    res.status(200).json({
      success: true,
      estimate,
    });
  } catch (error) {
    next(error);
  }
};

