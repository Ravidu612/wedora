import Vendor from '../models/Vendor.js';
import Expense from '../models/Expense.js';
import { roundToTwoDecimals } from '../services/calculationService.js';

// @desc Create vendor
// @route POST /api/weddings/:id/vendors
export const createVendor = async (req, res, next) => {
  try {
    const {
      name,
      category,
      contactPerson,
      phone,
      email,
      address,
      website,
      quotedAmount = 0,
      contractAmount = 0,
      advancePaid = 0,
      bookingStatus = 'Not Contacted',
      bookingDate,
      paymentDeadline,
      rating = 5,
      notes,
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Vendor name and category are required.' });
    }

    const vendor = await Vendor.create({
      wedding: req.params.id,
      name,
      category,
      contactPerson,
      phone,
      email,
      address,
      website,
      quotedAmount: roundToTwoDecimals(quotedAmount),
      contractAmount: roundToTwoDecimals(contractAmount),
      advancePaid: roundToTwoDecimals(advancePaid),
      bookingStatus,
      bookingDate,
      paymentDeadline,
      rating,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Vendor added successfully.',
      vendor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all vendors
// @route GET /api/weddings/:id/vendors
export const getVendors = async (req, res, next) => {
  try {
    const { category, bookingStatus, search } = req.query;

    const query = { wedding: req.params.id };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (bookingStatus && bookingStatus !== 'All') {
      query.bookingStatus = bookingStatus;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
      ];
    }

    const vendors = await Vendor.find(query).sort({ category: 1, name: 1 });

    let totalQuoted = 0;
    let totalContracted = 0;
    let totalAdvancePaid = 0;

    for (const v of vendors) {
      totalQuoted += v.quotedAmount || 0;
      totalContracted += v.contractAmount || 0;
      totalAdvancePaid += v.advancePaid || 0;
    }

    res.status(200).json({
      success: true,
      count: vendors.length,
      summary: {
        totalQuoted: roundToTwoDecimals(totalQuoted),
        totalContracted: roundToTwoDecimals(totalContracted),
        totalAdvancePaid: roundToTwoDecimals(totalAdvancePaid),
        totalRemaining: roundToTwoDecimals(totalContracted - totalAdvancePaid),
      },
      vendors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update vendor
// @route PUT /api/weddings/:id/vendors/:vendorId
export const updateVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOneAndUpdate(
      { _id: req.params.vendorId, wedding: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Vendor updated successfully.',
      vendor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete vendor
// @route DELETE /api/weddings/:id/vendors/:vendorId
export const deleteVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOneAndDelete({
      _id: req.params.vendorId,
      wedding: req.params.id,
    });

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Vendor removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

