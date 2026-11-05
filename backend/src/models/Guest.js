import mongoose from 'mongoose';

const guestSchema = new mongoose.Schema(
  {
    wedding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wedding',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide guest name'],
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      enum: [
        'Bride Family',
        'Groom Family',
        'Bride Friends',
        'Groom Friends',
        'Relatives',
        'Colleagues',
        'VIP',
        'Other',
      ],
      default: 'Relatives',
      index: true,
    },
    group: {
      type: String,
      default: 'Family & Friends',
    },
    invitationStatus: {
      type: String,
      enum: ['Not Sent', 'Sent', 'Delivered', 'Opened'],
      default: 'Not Sent',
    },
    rsvpStatus: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined'],
      default: 'Pending',
      index: true,
    },
    attendeesCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    hasPlusOne: {
      type: Boolean,
      default: false,
    },
    plusOneName: {
      type: String,
      default: '',
    },
    childrenCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    dietaryPreferences: {
      type: String,
      default: 'Standard / Non-Veg',
      enum: ['Standard / Non-Veg', 'Vegetarian', 'Vegan', 'Halal', 'No Seafood', 'Other / Special'],
    },
    specialNotes: {
      type: String,
      default: '',
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SeatingTable',
    },
    tableNumber: {
      type: String,
      default: '',
    },
    eventsAttending: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Guest', guestSchema);

