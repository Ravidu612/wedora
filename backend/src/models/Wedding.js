import mongoose from 'mongoose';

const weddingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    brideName: {
      type: String,
      required: [true, 'Please provide the Bride name'],
      trim: true,
    },
    groomName: {
      type: String,
      required: [true, 'Please provide the Groom name'],
      trim: true,
    },
    weddingDate: {
      type: Date,
      required: [true, 'Please provide the Wedding date'],
    },
    homecomingDate: {
      type: Date,
    },
    location: {
      type: String,
      default: 'Colombo, Sri Lanka',
      trim: true,
    },
    venue: {
      type: String,
      default: '',
      trim: true,
    },
    weddingType: {
      type: String,
      default: 'Traditional Sri Lankan (Kandyan)',
      trim: true,
    },
    weddingTheme: {
      type: String,
      default: 'Champagne Gold & Ivory',
      trim: true,
    },
    estimatedGuestCount: {
      type: Number,
      default: 200,
      min: 0,
    },
    totalBudget: {
      type: Number,
      default: 2500000,
      min: 0,
    },
    brideSideBudget: {
      type: Number,
      default: 1000000,
      min: 0,
    },
    groomSideBudget: {
      type: Number,
      default: 1000000,
      min: 0,
    },
    sharedBudget: {
      type: Number,
      default: 500000,
      min: 0,
    },
    monthlySavingsTarget: {
      type: Number,
      default: 0,
      min: 0,
    },
    emergencyReserve: {
      type: Number,
      default: 100000,
      min: 0,
    },
    currency: {
      type: String,
      default: 'LKR',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['planning', 'completed', 'archived'],
      default: 'planning',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Wedding', weddingSchema);

