import mongoose from 'mongoose';

const weddingMemberSchema = new mongoose.Schema(
  {
    wedding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wedding',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['owner', 'partner', 'family_collaborator', 'viewer'],
      default: 'partner',
    },
    permissions: {
      type: [String],
      default: ['read', 'write'],
      enum: ['read', 'write', 'admin', 'financial_only', 'guest_only'],
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    inviteEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'accepted',
    },
  },
  {
    timestamps: true,
  }
);

weddingMemberSchema.index({ wedding: 1, user: 1 }, { unique: true });

export default mongoose.model('WeddingMember', weddingMemberSchema);

