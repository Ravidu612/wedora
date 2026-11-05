import mongoose from 'mongoose';

const expenseCategorySchema = new mongoose.Schema(
  {
    wedding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wedding',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    allocatedBudget: {
      type: Number,
      default: 0,
      min: 0,
    },
    icon: {
      type: String,
      default: 'DollarSign',
    },
    color: {
      type: String,
      default: '#C9A46A',
    },
    side: {
      type: String,
      enum: ['Bride', 'Groom', 'Shared', 'Both'],
      default: 'Shared',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

expenseCategorySchema.index({ wedding: 1, name: 1 }, { unique: true });

export default mongoose.model('ExpenseCategory', expenseCategorySchema);

