import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    wedding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wedding',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide expense name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify category'],
      default: 'Other',
      index: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WeddingEvent',
    },
    eventName: {
      type: String,
      default: 'Main Wedding',
    },
    description: {
      type: String,
      default: '',
    },
    estimatedAmount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Estimated amount cannot be negative'],
    },
    quotedAmount: {
      type: Number,
      default: 0,
      min: [0, 'Quoted amount cannot be negative'],
    },
    actualAmount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Actual amount cannot be negative'],
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: [0, 'Paid amount cannot be negative'],
    },
    expenseOwner: {
      type: String,
      enum: ['Bride', 'Groom', 'Bride Family', 'Groom Family', 'Shared'],
      default: 'Shared',
      index: true,
    },
    payer: {
      type: String,
      enum: ['Bride', 'Groom', 'Bride Family', 'Groom Family', 'Shared', 'Custom'],
      default: 'Shared',
    },
    customPayerName: {
      type: String,
      default: '',
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
    },
    vendorName: {
      type: String,
      default: '',
    },
    paymentDeadline: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Partially Paid', 'Paid', 'Overdue'],
      default: 'Unpaid',
    },
    notes: {
      type: String,
      default: '',
    },
    receipts: [
      {
        url: String,
        name: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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

// Virtual property for outstanding balance
expenseSchema.virtual('outstandingAmount').get(function () {
  const actual = this.actualAmount || this.estimatedAmount || 0;
  return Math.max(0, actual - (this.paidAmount || 0));
});

export default mongoose.model('Expense', expenseSchema);

