import mongoose from 'mongoose';

const timelineItemSchema = new mongoose.Schema(
  {
    wedding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wedding',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide timeline item title'],
      trim: true,
    },
    startTime: {
      type: String,
      required: true,
      default: '09:00 AM',
    },
    endTime: {
      type: String,
      default: '09:30 AM',
    },
    location: {
      type: String,
      default: 'Main Ballroom',
    },
    responsiblePerson: {
      type: String,
      default: 'Best Man & Bridesmaids',
    },
    order: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Scheduled', 'In Progress', 'Completed'],
      default: 'Scheduled',
    },
  },
  {
    timestamps: true,
  }
);

timelineItemSchema.index({ wedding: 1, order: 1 });

export default mongoose.model('TimelineItem', timelineItemSchema);

