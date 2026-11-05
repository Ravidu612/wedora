import Payment from '../models/Payment.js';
import Expense from '../models/Expense.js';
import Vendor from '../models/Vendor.js';
import { roundToTwoDecimals, validatePaymentAmount } from '../services/calculationService.js';

// @desc Record a new payment
// @route POST /api/weddings/:id/payments
export const createPayment = async (req, res, next) => {
  try {
    const {
      expenseId,
      amount,
      paymentDate = new Date(),
      paymentMethod = 'Bank Transfer',
      vendorId,
      payer = 'Shared',
      referenceNumber,
      notes,
      receiptUrl,
      allowOverpayment = false,
    } = req.body;

    const numAmount = roundToTwoDecimals(amount);
    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount must be greater than zero.',
      });
    }

    let expense = null;
    if (expenseId) {
      expense = await Expense.findOne({ _id: expenseId, wedding: req.params.id });
      if (!expense) {
        return res.status(404).json({ success: false, message: 'Expense not found.' });
      }

      // Check validation using calculation engine
      const validation = validatePaymentAmount(
        expense.actualAmount,
        expense.paidAmount,
        numAmount,
        allowOverpayment
      );

      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.error,
          outstanding: validation.outstanding,
        });
      }

      // Update expense paid amount and status
      expense.paidAmount = validation.newTotalPaid;
      if (validation.newOutstanding === 0) {
        expense.paymentStatus = 'Paid';
      } else {
        expense.paymentStatus = 'Partially Paid';
      }
      await expense.save();
    }

    // If vendor provided, update vendor's advancePaid
    let vendor = null;
    if (vendorId) {
      vendor = await Vendor.findOne({ _id: vendorId, wedding: req.params.id });
      if (vendor) {
        vendor.advancePaid = roundToTwoDecimals((vendor.advancePaid || 0) + numAmount);
        await vendor.save();
      }
    }

    const payment = await Payment.create({
      wedding: req.params.id,
      expense: expense ? expense._id : null,
      expenseName: expense ? expense.name : 'Direct Payment',
      amount: numAmount,
      paymentDate,
      paymentMethod,
      vendor: vendor ? vendor._id : (expense?.vendor || null),
      vendorName: vendor ? vendor.name : (expense?.vendorName || ''),
      payer,
      referenceNumber,
      notes,
      receiptUrl,
      status: 'Paid',
    });

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully.',
      payment,
      updatedExpense: expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all payments for a wedding
// @route GET /api/weddings/:id/payments
export const getPayments = async (req, res, next) => {
  try {
    const { paymentMethod, status, sortBy = 'paymentDate', order = 'desc' } = req.query;

    const query = {
      wedding: req.params.id,
      isDeleted: false,
    };

    if (paymentMethod && paymentMethod !== 'All') {
      query.paymentMethod = paymentMethod;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const sortOption = {};
    sortOption[sortBy] = order === 'asc' ? 1 : -1;

    const payments = await Payment.find(query)
      .sort(sortOption)
      .populate('expense', 'name category actualAmount paidAmount')
      .populate('vendor', 'name contactPerson phone');

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete/void a payment (reverses balance on expense)
// @route DELETE /api/weddings/:id/payments/:paymentId
export const deletePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.paymentId,
      wedding: req.params.id,
      isDeleted: false,
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    // Revert paid amount on associated expense
    if (payment.expense) {
      const expense = await Expense.findById(payment.expense);
      if (expense) {
        expense.paidAmount = Math.max(0, roundToTwoDecimals(expense.paidAmount - payment.amount));
        if (expense.paidAmount === 0) {
          expense.paymentStatus = 'Unpaid';
        } else if (expense.paidAmount < expense.actualAmount) {
          expense.paymentStatus = 'Partially Paid';
        }
        await expense.save();
      }
    }

    // Revert vendor advance if applicable
    if (payment.vendor) {
      const vendor = await Vendor.findById(payment.vendor);
      if (vendor) {
        vendor.advancePaid = Math.max(0, roundToTwoDecimals(vendor.advancePaid - payment.amount));
        await vendor.save();
      }
    }

    payment.isDeleted = true;
    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Payment reversed and deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

