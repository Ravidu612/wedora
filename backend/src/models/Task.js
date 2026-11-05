import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    wedding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wedding',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide task title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'General',
    },
    timelineBucket: {
      type: String,
      enum: [
        '12 Months Before',
        '9 Months Before',
        '6 Months Before',
        '3 Months Before',
        '1 Month Before',
        '1 Week Before',
        'Wedding Day',
        'Post Wedding',
      ],
      default: '6 Months Before',
      index: true,
    },
    dueDate: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    assignedTo: {
      type: String,
      enum: ['Bride', 'Groom', 'Shared', 'Bride Family', 'Groom Family'],
      default: 'Shared',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
      index: true,
    },
    isPredefined: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Task', taskSchema);

