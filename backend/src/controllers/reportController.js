import Wedding from '../models/Wedding.js';
import Expense from '../models/Expense.js';
import Payment from '../models/Payment.js';
import Contribution from '../models/Contribution.js';
import Guest from '../models/Guest.js';
import Vendor from '../models/Vendor.js';
import { generateBudgetPDF } from '../services/reportService.js';

// @desc Generate & stream Budget PDF report
// @route GET /api/weddings/:id/reports/budget-pdf
export const exportBudgetPDF = async (req, res, next) => {
  try {
    const wedding = await Wedding.findById(req.params.id);
    if (!wedding) {
      return res.status(404).json({ success: false, message: 'Wedding not found.' });
    }

    const [expenses, payments, contributions] = await Promise.all([
      Expense.find({ wedding: wedding._id, isDeleted: false }),
      Payment.find({ wedding: wedding._id, isDeleted: false }),
      Contribution.find({ wedding: wedding._id, isDeleted: false }),
    ]);

    const pdfBuffer = await generateBudgetPDF({ wedding, expenses, payments, contributions });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Wedora_Budget_Report_${wedding.brideName}_and_${wedding.groomName}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

// @desc Export guests list as CSV
// @route GET /api/weddings/:id/reports/guests-csv
export const exportGuestsCSV = async (req, res, next) => {
  try {
    const guests = await Guest.find({ wedding: req.params.id }).populate('table', 'tableNumber tableName');

    const headers = [
      'Name',
      'Phone',
      'Email',
      'Category',
      'Group',
      'RSVP Status',
      'Attendees Count',
      'Plus One',
      'Dietary Preferences',
      'Table Number',
      'Special Notes',
    ];

    const rows = guests.map(g => [
      `"${g.name.replace(/"/g, '""')}"`,
      `"${(g.phone || '').replace(/"/g, '""')}"`,
      `"${(g.email || '').replace(/"/g, '""')}"`,
      `"${g.category}"`,
      `"${g.group}"`,
      `"${g.rsvpStatus}"`,
      g.attendeesCount || 1,
      g.hasPlusOne ? 'Yes' : 'No',
      `"${g.dietaryPreferences}"`,
      `"${g.table ? (g.table.tableNumber || '') : ''}"`,
      `"${(g.specialNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=Wedora_Guests.csv');
    res.send(csvContent);
  } catch (error) {
    next(error);
  }
};

