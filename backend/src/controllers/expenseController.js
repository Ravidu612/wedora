import Expense from '../models/Expense.js';
import ExpenseCategory from '../models/ExpenseCategory.js';
import Payment from '../models/Payment.js';
import { roundToTwoDecimals } from '../services/calculationService.js';

// @desc Create a new expense
// @route POST /api/weddings/:id/expenses
export const createExpense = async (req, res, next) => {
  try {
    const {
      name,
      category,
      event,
      eventName,
      description,
      estimatedAmount = 0,
      quotedAmount = 0,
      actualAmount = 0,
      paidAmount = 0,
      expenseOwner = 'Shared',
      payer = 'Shared',
      customPayerName,
      vendor,
      vendorName,
      paymentDeadline,
      notes,
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Expense name and category are required.',
      });
    }

    const est = Math.max(0, roundToTwoDecimals(estimatedAmount));
    const act = Math.max(0, roundToTwoDecimals(actualAmount || est));
    const paid = Math.max(0, roundToTwoDecimals(paidAmount));

    let paymentStatus = 'Unpaid';
    if (paid >= act && act > 0) {
      paymentStatus = 'Paid';
    } else if (paid > 0) {
      paymentStatus = 'Partially Paid';
    }

    const expense = await Expense.create({
      wedding: req.params.id,
      name,
      category,
      event,
      eventName: eventName || 'Main Wedding',
      description,
      estimatedAmount: est,
      quotedAmount: Math.max(0, roundToTwoDecimals(quotedAmount)),
      actualAmount: act,
      paidAmount: paid,
      expenseOwner,
      payer,
      customPayerName,
      vendor,
      vendorName,
      paymentDeadline,
      paymentStatus,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Expense created successfully.',
      expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get expenses for wedding with filters, search, and sorting
// @route GET /api/weddings/:id/expenses
export const getExpenses = async (req, res, next) => {
  try {
    const {
      search,
      category,
      expenseOwner,
      payer,
      paymentStatus,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {
      wedding: req.params.id,
      isDeleted: false,
    };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (expenseOwner && expenseOwner !== 'All') {
      query.expenseOwner = expenseOwner;
    }

    if (payer && payer !== 'All') {
      query.payer = payer;
    }

    if (paymentStatus && paymentStatus !== 'All') {
      query.paymentStatus = paymentStatus;
    }

    const sortOption = {};
    sortOption[sortBy] = order === 'asc' ? 1 : -1;

    const expenses = await Expense.find(query)
      .sort(sortOption)
      .populate('vendor', 'name phone email category');

    res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single expense by ID
// @route GET /api/weddings/:id/expenses/:expenseId
export const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.expenseId,
      wedding: req.params.id,
      isDeleted: false,
    }).populate('vendor', 'name phone email');

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    }

    // Also get related payments for this expense
    const payments = await Payment.find({
      expense: expense._id,
      isDeleted: false,
    }).sort({ paymentDate: -1 });

    res.status(200).json({
      success: true,
      expense,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update expense
// @route PUT /api/weddings/:id/expenses/:expenseId
export const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.expenseId,
      wedding: req.params.id,
    });

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    }

    const updates = { ...req.body };
    if (updates.estimatedAmount !== undefined) {
      updates.estimatedAmount = Math.max(0, roundToTwoDecimals(updates.estimatedAmount));
    }
    if (updates.actualAmount !== undefined) {
      updates.actualAmount = Math.max(0, roundToTwoDecimals(updates.actualAmount));
    }
    if (updates.quotedAmount !== undefined) {
      updates.quotedAmount = Math.max(0, roundToTwoDecimals(updates.quotedAmount));
    }

    // Auto-update status based on actual and paid
    const actual = updates.actualAmount !== undefined ? updates.actualAmount : expense.actualAmount;
    const paid = updates.paidAmount !== undefined ? updates.paidAmount : expense.paidAmount;

    if (paid >= actual && actual > 0) {
      updates.paymentStatus = 'Paid';
    } else if (paid > 0) {
      updates.paymentStatus = 'Partially Paid';
    } else {
      updates.paymentStatus = 'Unpaid';
    }

    Object.assign(expense, updates);
    await expense.save();

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully.',
      expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Soft-delete expense
// @route DELETE /api/weddings/:id/expenses/:expenseId
export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.expenseId,
      wedding: req.params.id,
    });

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    }

    expense.isDeleted = true;
    await expense.save();

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get bride-specific expenses
// @route GET /api/weddings/:id/expenses/bride
export const getBrideExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({
      wedding: req.params.id,
      expenseOwner: { $in: ['Bride', 'Bride Family'] },
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get groom-specific expenses
// @route GET /api/weddings/:id/expenses/groom
export const getGroomExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({
      wedding: req.params.id,
      expenseOwner: { $in: ['Groom', 'Groom Family'] },
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get expense categories for wedding
// @route GET /api/weddings/:id/categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await ExpenseCategory.find({ wedding: req.params.id }).sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create custom category
// @route POST /api/weddings/:id/categories
export const createCategory = async (req, res, next) => {
  try {
    const { name, allocatedBudget = 0, side = 'Shared', icon = 'Tag' } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const category = await ExpenseCategory.create({
      wedding: req.params.id,
      name,
      allocatedBudget: roundToTwoDecimals(allocatedBudget),
      side,
      icon,
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

