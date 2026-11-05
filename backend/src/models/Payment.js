import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    wedding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wedding',
      required: true,
      index: true,
    },
    expense: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expense',
      index: true,
    },
    expenseName: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      required: [true, 'Please provide payment amount'],
      min: [0.01, 'Payment amount must be greater than zero'],
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Bank Transfer', 'Card', 'Online Payment', 'Cheque', 'Other'],
      default: 'Bank Transfer',
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
    },
    vendorName: {
      type: String,
      default: '',
    },
    payer: {
      type: String,
      default: 'Shared',
    },
    referenceNumber: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Paid', 'Partially Paid', 'Unpaid', 'Overdue'],
      default: 'Paid',
    },
    notes: {
      type: String,
      default: '',
    },
    receiptUrl: {
      type: String,
      default: '',
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Payment', paymentSchema);

