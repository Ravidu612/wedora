import mongoose from 'mongoose';

const weddingEventSchema = new mongoose.Schema(
  {
    wedding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wedding',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    eventType: {
      type: String,
      enum: [
        'Poruwa Ceremony',
        'Church Ceremony',
        'Kovil / Hindu Ceremony',
        'Nikah Ceremony',
        'Western Ceremony',
        'Reception',
        'Homecoming',
        'Engagement',
        'Mehendi / Sangeet',
        'Bachelor / Bachelorette Party',
        'Pre-Wedding Shoot',
        'Other',
      ],
      default: 'Poruwa Ceremony',
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      default: '09:00 AM',
    },
    endTime: {
      type: String,
      default: '02:00 PM',
    },
    venue: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    dressCode: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('WeddingEvent', weddingEventSchema);

