import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema(
  {
    wedding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wedding',
      required: true,
      index: true,
    },
    contributorName: {
      type: String,
      required: [true, 'Please provide contributor name'],
      trim: true,
    },
    familySide: {
      type: String,
      required: true,
      enum: ['Bride Family', 'Groom Family', 'Bride', 'Groom', 'Shared', 'Other'],
      default: 'Bride Family',
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide contribution amount'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    contributionDate: {
      type: Date,
      default: Date.now,
    },
    contributionType: {
      type: String,
      enum: ['Cash', 'Bank Transfer', 'Cheque', 'Gold / Jewellery', 'Gift', 'Other'],
      default: 'Cash',
    },
    contributionMethod: {
      type: String,
      default: 'Direct Contribution',
    },
    notes: {
      type: String,
      default: '',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Contribution', contributionSchema);

