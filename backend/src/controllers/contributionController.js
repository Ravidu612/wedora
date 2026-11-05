import Contribution from '../models/Contribution.js';
import { roundToTwoDecimals } from '../services/calculationService.js';

// @desc Add a new family / personal contribution
// @route POST /api/weddings/:id/contributions
export const createContribution = async (req, res, next) => {
  try {
    const {
      contributorName,
      familySide = 'Bride Family',
      amount,
      contributionDate = new Date(),
      contributionType = 'Cash',
      contributionMethod = 'Direct Contribution',
      notes,
    } = req.body;

    const numAmount = roundToTwoDecimals(amount);
    if (!contributorName || !numAmount || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Contributor name and a positive contribution amount are required.',
      });
    }

    const contribution = await Contribution.create({
      wedding: req.params.id,
      contributorName,
      familySide,
      amount: numAmount,
      contributionDate,
      contributionType,
      contributionMethod,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Contribution recorded successfully.',
      contribution,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all contributions for wedding
// @route GET /api/weddings/:id/contributions
export const getContributions = async (req, res, next) => {
  try {
    const { familySide, contributionType } = req.query;

    const query = {
      wedding: req.params.id,
      isDeleted: false,
    };

    if (familySide && familySide !== 'All') {
      query.familySide = familySide;
    }

    if (contributionType && contributionType !== 'All') {
      query.contributionType = contributionType;
    }

    const contributions = await Contribution.find(query).sort({ contributionDate: -1 });

    // Calculate sub-totals
    let totalBrideFamily = 0;
    let totalGroomFamily = 0;
    let totalCouple = 0;
    let totalContributions = 0;

    for (const c of contributions) {
      totalContributions += c.amount;
      if (c.familySide === 'Bride Family') totalBrideFamily += c.amount;
      else if (c.familySide === 'Groom Family') totalGroomFamily += c.amount;
      else if (c.familySide === 'Bride' || c.familySide === 'Groom' || c.familySide === 'Shared') {
        totalCouple += c.amount;
      }
    }

    res.status(200).json({
      success: true,
      count: contributions.length,
      totals: {
        totalContributions: roundToTwoDecimals(totalContributions),
        totalBrideFamily: roundToTwoDecimals(totalBrideFamily),
        totalGroomFamily: roundToTwoDecimals(totalGroomFamily),
        totalCouple: roundToTwoDecimals(totalCouple),
      },
      contributions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update a contribution
// @route PUT /api/weddings/:id/contributions/:contributionId
export const updateContribution = async (req, res, next) => {
  try {
    const contribution = await Contribution.findOne({
      _id: req.params.contributionId,
      wedding: req.params.id,
    });

    if (!contribution) {
      return res.status(404).json({ success: false, message: 'Contribution not found.' });
    }

    const updates = { ...req.body };
    if (updates.amount !== undefined) {
      updates.amount = roundToTwoDecimals(updates.amount);
    }

    Object.assign(contribution, updates);
    await contribution.save();

    res.status(200).json({
      success: true,
      message: 'Contribution updated successfully.',
      contribution,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete a contribution
// @route DELETE /api/weddings/:id/contributions/:contributionId
export const deleteContribution = async (req, res, next) => {
  try {
    const contribution = await Contribution.findOne({
      _id: req.params.contributionId,
      wedding: req.params.id,
    });

    if (!contribution) {
      return res.status(404).json({ success: false, message: 'Contribution not found.' });
    }

    contribution.isDeleted = true;
    await contribution.save();

    res.status(200).json({
      success: true,
      message: 'Contribution deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

