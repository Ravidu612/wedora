import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
  {
    wedding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wedding',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide vendor name'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Hotels & Reception Halls',
        'Photography',
        'Videography',
        'Bridal Dressing & Salon',
        'Groom Dressing',
        'Catering',
        'Decorations & Florists',
        'Poruwa & Cultural Items',
        'Cake Suppliers',
        'Music, DJ & Band',
        'Wedding Planners',
        'Transport & Vehicles',
        'Jewellery Shops',
        'Invitations & Stationery',
        'Other',
      ],
      default: 'Photography',
      index: true,
    },
    contactPerson: {
      type: String,
      default: '',
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
    address: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    quotedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    contractAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    advancePaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    bookingStatus: {
      type: String,
      enum: [
        'Not Contacted',
        'Contacted',
        'Quotation Received',
        'Negotiating',
        'Booked',
        'Cancelled',
      ],
      default: 'Not Contacted',
      index: true,
    },
    bookingDate: {
      type: Date,
    },
    paymentDeadline: {
      type: Date,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    notes: {
      type: String,
      default: '',
    },
    attachments: [
      {
        url: String,
        name: String,
        fileType: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Virtual for remaining vendor balance
vendorSchema.virtual('remainingPayment').get(function () {
  const contract = this.contractAmount || this.quotedAmount || 0;
  return Math.max(0, contract - (this.advancePaid || 0));
});

export default mongoose.model('Vendor', vendorSchema);

