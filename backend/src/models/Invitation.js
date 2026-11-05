import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema(
  {
    wedding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wedding',
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    template: {
      type: String,
      enum: [
        'royal-kandyan',
        'classic-ivory',
        'botanical-blush',
        'modern-minimalist',
        'poruwa-heritage',
      ],
      default: 'royal-kandyan',
    },
    title: {
      type: String,
      default: 'The Wedding Celebration',
    },
    customMessage: {
      type: String,
      default: 'Together with their families, invite you to share in the joy of their wedding celebration.',
    },
    brideName: {
      type: String,
      required: true,
    },
    groomName: {
      type: String,
      required: true,
    },
    weddingDate: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'Colombo, Sri Lanka',
    },
    dressCode: {
      type: String,
      default: 'Traditional / Formal',
    },
    accentColor: {
      type: String,
      default: '#C9A46A',
    },
    fontFamily: {
      type: String,
      default: 'Playfair Display',
    },
    backgroundPattern: {
      type: String,
      default: 'gold-filigree',
    },
    schedule: [
      {
        time: String,
        title: String,
        description: String,
      },
    ],
    isRSVPEnabled: {
      type: Boolean,
      default: true,
    },
    rsvpDeadline: {
      type: Date,
    },
    allowPlusOne: {
      type: Boolean,
      default: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Invitation', invitationSchema);

