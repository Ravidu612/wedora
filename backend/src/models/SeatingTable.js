import mongoose from 'mongoose';

const seatingTableSchema = new mongoose.Schema(
  {
    wedding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wedding',
      required: true,
      index: true,
    },
    tableNumber: {
      type: String,
      required: true,
      trim: true,
    },
    tableName: {
      type: String,
      default: '',
      trim: true,
    },
    tableType: {
      type: String,
      enum: ['Round', 'Rectangular', 'Square'],
      default: 'Round',
    },
    capacity: {
      type: Number,
      required: true,
      default: 10,
      min: [1, 'Capacity must be at least 1'],
    },
    category: {
      type: String,
      enum: [
        'Head Table / VIP',
        'Bride Family',
        'Groom Family',
        'Bride Friends',
        'Groom Friends',
        'Relatives',
        'Colleagues',
        'General',
      ],
      default: 'General',
    },
    locationZone: {
      type: String,
      default: 'Main Hall',
    },
    assignedGuests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guest',
      },
    ],
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

seatingTableSchema.index({ wedding: 1, tableNumber: 1 }, { unique: true });

export default mongoose.model('SeatingTable', seatingTableSchema);

