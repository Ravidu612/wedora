/**
 * Centralized Calculation Engine for Wedora Frontend
 * Mirrored from backend/src/services/calculationService.js
 */

export const roundToTwoDecimals = (val) => {
  const num = Number(val) || 0;
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export function calculateWeddingFinancials({
  totalBudget = 0,
  expenses = [],
  payments = [],
  contributions = [],
  weddingDate = null,
}) {
  const budget = Math.max(0, roundToTwoDecimals(totalBudget));

  let totalEstimatedExpenses = 0;
  let totalActualExpenses = 0;
  let totalPaidFromExpenses = 0;

  const ownershipMap = {
    Bride: { estimated: 0, actual: 0, paid: 0, outstanding: 0 },
    Groom: { estimated: 0, actual: 0, paid: 0, outstanding: 0 },
    'Bride Family': { estimated: 0, actual: 0, paid: 0, outstanding: 0 },
    'Groom Family': { estimated: 0, actual: 0, paid: 0, outstanding: 0 },
    Shared: { estimated: 0, actual: 0, paid: 0, outstanding: 0 },
    Other: { estimated: 0, actual: 0, paid: 0, outstanding: 0 },
  };

  const categoryMap = {};

  for (const exp of expenses) {
    if (exp.isDeleted) continue;

    const estimated = Math.max(0, roundToTwoDecimals(exp.estimatedAmount || 0));
    const actual = Math.max(0, roundToTwoDecimals(exp.actualAmount !== undefined && exp.actualAmount !== null ? exp.actualAmount : estimated));
    const paid = Math.max(0, roundToTwoDecimals(exp.paidAmount || 0));
    const outstanding = Math.max(0, roundToTwoDecimals(actual - paid));

    totalEstimatedExpenses += estimated;
    totalActualExpenses += actual;
    totalPaidFromExpenses += paid;

    const owner = ownershipMap[exp.expenseOwner] ? exp.expenseOwner : 'Shared';
    ownershipMap[owner].estimated += estimated;
    ownershipMap[owner].actual += actual;
    ownershipMap[owner].paid += paid;
    ownershipMap[owner].outstanding += outstanding;

    const cat = exp.category || 'Other';
    if (!categoryMap[cat]) {
      categoryMap[cat] = {
        name: cat,
        estimated: 0,
        actual: 0,
        paid: 0,
        outstanding: 0,
        count: 0,
      };
    }
    categoryMap[cat].estimated += estimated;
    categoryMap[cat].actual += actual;
    categoryMap[cat].paid += paid;
    categoryMap[cat].outstanding += outstanding;
    categoryMap[cat].count += 1;
  }

  let totalPaid = 0;
  const validPayments = payments.filter(p => !p.isDeleted);
  for (const p of validPayments) {
    const pAmt = Math.max(0, roundToTwoDecimals(p.amount || 0));
    totalPaid += pAmt;
  }

  const effectivePaid = validPayments.length > 0 ? roundToTwoDecimals(totalPaid) : roundToTwoDecimals(totalPaidFromExpenses);
  const totalOutstanding = Math.max(0, roundToTwoDecimals(totalActualExpenses - effectivePaid));
  const remainingBudget = roundToTwoDecimals(budget - totalActualExpenses);
  const budgetUtilization = budget > 0 ? roundToTwoDecimals((totalActualExpenses / budget) * 100) : 0;
  const budgetVariance = roundToTwoDecimals(totalActualExpenses - budget);

  let totalContributions = 0;
  const contributionSides = {
    'Bride Family': 0,
    'Groom Family': 0,
    Bride: 0,
    Groom: 0,
    Shared: 0,
    Other: 0,
  };

  for (const c of contributions) {
    if (c.isDeleted) continue;
    const cAmt = Math.max(0, roundToTwoDecimals(c.amount || 0));
    totalContributions += cAmt;
    const side = contributionSides[c.familySide] !== undefined ? c.familySide : 'Other';
    contributionSides[side] += cAmt;
  }

  const netRequiredFunding = Math.max(0, roundToTwoDecimals(totalActualExpenses - totalContributions));
  let remainingMonths = 1;

  if (weddingDate) {
    const target = new Date(weddingDate);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    remainingMonths = Math.max(1, Math.ceil(diffDays / 30.4375));
  }

  const monthlySavingsRequired = roundToTwoDecimals(netRequiredFunding / remainingMonths);

  const warnings = [];
  if (budget > 0 && budgetUtilization >= 100) {
    warnings.push({
      type: 'danger',
      code: 'BUDGET_EXCEEDED',
      message: `Budget exceeded! Current expenses are ${budgetUtilization.toFixed(1)}% of your total budget.`,
    });
  } else if (budget > 0 && budgetUtilization >= 80) {
    warnings.push({
      type: 'warning',
      code: 'BUDGET_NEAR_LIMIT',
      message: `Budget warning: You have utilized ${budgetUtilization.toFixed(1)}% of your allocated budget.`,
    });
  }

  return {
    totalBudget: budget,
    totalEstimatedExpenses: roundToTwoDecimals(totalEstimatedExpenses),
    totalActualExpenses: roundToTwoDecimals(totalActualExpenses),
    totalPaid: effectivePaid,
    totalOutstanding: roundToTwoDecimals(totalOutstanding),
    remainingBudget,
    budgetUtilization,
    budgetVariance,
    brideExpenses: roundToTwoDecimals(ownershipMap.Bride.actual),
    groomExpenses: roundToTwoDecimals(ownershipMap.Groom.actual),
    brideFamilyExpenses: roundToTwoDecimals(ownershipMap['Bride Family'].actual),
    groomFamilyExpenses: roundToTwoDecimals(ownershipMap['Groom Family'].actual),
    sharedExpenses: roundToTwoDecimals(ownershipMap.Shared.actual),
    ownershipBreakdown: {
      Bride: {
        estimated: roundToTwoDecimals(ownershipMap.Bride.estimated),
        actual: roundToTwoDecimals(ownershipMap.Bride.actual),
        paid: roundToTwoDecimals(ownershipMap.Bride.paid),
        outstanding: roundToTwoDecimals(ownershipMap.Bride.outstanding),
      },
      Groom: {
        estimated: roundToTwoDecimals(ownershipMap.Groom.estimated),
        actual: roundToTwoDecimals(ownershipMap.Groom.actual),
        paid: roundToTwoDecimals(ownershipMap.Groom.paid),
        outstanding: roundToTwoDecimals(ownershipMap.Groom.outstanding),
      },
      'Bride Family': {
        estimated: roundToTwoDecimals(ownershipMap['Bride Family'].estimated),
        actual: roundToTwoDecimals(ownershipMap['Bride Family'].actual),
        paid: roundToTwoDecimals(ownershipMap['Bride Family'].paid),
        outstanding: roundToTwoDecimals(ownershipMap['Bride Family'].outstanding),
      },
      'Groom Family': {
        estimated: roundToTwoDecimals(ownershipMap['Groom Family'].estimated),
        actual: roundToTwoDecimals(ownershipMap['Groom Family'].actual),
        paid: roundToTwoDecimals(ownershipMap['Groom Family'].paid),
        outstanding: roundToTwoDecimals(ownershipMap['Groom Family'].outstanding),
      },
      Shared: {
        estimated: roundToTwoDecimals(ownershipMap.Shared.estimated),
        actual: roundToTwoDecimals(ownershipMap.Shared.actual),
        paid: roundToTwoDecimals(ownershipMap.Shared.paid),
        outstanding: roundToTwoDecimals(ownershipMap.Shared.outstanding),
      },
    },
    categoryBreakdown: Object.values(categoryMap).map(c => ({
      ...c,
      estimated: roundToTwoDecimals(c.estimated),
      actual: roundToTwoDecimals(c.actual),
      paid: roundToTwoDecimals(c.paid),
      outstanding: roundToTwoDecimals(c.outstanding),
    })),
    totalContributions: roundToTwoDecimals(totalContributions),
    contributionsBySide: {
      'Bride Family': roundToTwoDecimals(contributionSides['Bride Family']),
      'Groom Family': roundToTwoDecimals(contributionSides['Groom Family']),
      Bride: roundToTwoDecimals(contributionSides.Bride),
      Groom: roundToTwoDecimals(contributionSides.Groom),
      Shared: roundToTwoDecimals(contributionSides.Shared),
      Other: roundToTwoDecimals(contributionSides.Other),
    },
    savingsPlanner: {
      netRequiredFunding,
      remainingMonths,
      monthlySavingsRequired,
    },
    warnings,
  };
}

export function calculateCateringEstimate({
  adultCount = 0,
  childCount = 0,
  adultPlateCost = 0,
  childPlateCost = 0,
  serviceChargePercent = 10,
  vatPercent = 0,
  additionalCharges = 0,
}) {
  const adultSubtotal = Math.max(0, adultCount) * Math.max(0, adultPlateCost);
  const childSubtotal = Math.max(0, childCount) * Math.max(0, childPlateCost);
  const foodSubtotal = adultSubtotal + childSubtotal;

  const serviceCharge = (foodSubtotal * Math.max(0, serviceChargePercent)) / 100;
  const taxableAmount = foodSubtotal + serviceCharge + Math.max(0, additionalCharges);
  const vat = (taxableAmount * Math.max(0, vatPercent)) / 100;

  const totalCost = taxableAmount + vat;
  const totalGuests = Number(adultCount) + Number(childCount);
  const averageCostPerGuest = totalGuests > 0 ? totalCost / totalGuests : 0;

  return {
    totalGuests,
    adultSubtotal: roundToTwoDecimals(adultSubtotal),
    childSubtotal: roundToTwoDecimals(childSubtotal),
    foodSubtotal: roundToTwoDecimals(foodSubtotal),
    serviceCharge: roundToTwoDecimals(serviceCharge),
    vat: roundToTwoDecimals(vat),
    additionalCharges: roundToTwoDecimals(additionalCharges),
    totalCost: roundToTwoDecimals(totalCost),
    averageCostPerGuest: roundToTwoDecimals(averageCostPerGuest),
  };
}

