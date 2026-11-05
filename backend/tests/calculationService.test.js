import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  calculateWeddingFinancials,
  validatePaymentAmount,
  calculateCateringEstimate,
  roundToTwoDecimals,
} from '../src/services/calculationService.js';

describe('Centralized Financial Calculation Engine', () => {
  test('handles zero budget safely without NaN or division by zero', () => {
    const res = calculateWeddingFinancials({
      totalBudget: 0,
      expenses: [],
      payments: [],
      contributions: [],
    });

    assert.strictEqual(res.totalBudget, 0);
    assert.strictEqual(res.totalActualExpenses, 0);
    assert.strictEqual(res.budgetUtilization, 0);
    assert.strictEqual(res.totalOutstanding, 0);
    assert.strictEqual(res.remainingBudget, 0);
    assert.deepStrictEqual(res.warnings, []);
  });

  test('calculates expenses, ownership splits, and paid amounts accurately', () => {
    const expenses = [
      {
        name: 'Bridal Dress',
        category: 'Bridal Dressing',
        expenseOwner: 'Bride',
        estimatedAmount: 250000,
        actualAmount: 275000,
        paidAmount: 100000,
      },
      {
        name: 'Groom Suit',
        category: 'Groom Dressing',
        expenseOwner: 'Groom',
        estimatedAmount: 150000,
        actualAmount: 140000,
        paidAmount: 140000,
      },
      {
        name: 'Reception Hall',
        category: 'Venue',
        expenseOwner: 'Shared',
        estimatedAmount: 1200000,
        actualAmount: 1200000,
        paidAmount: 500000,
      },
      {
        name: 'Deleted Item',
        category: 'Other',
        expenseOwner: 'Shared',
        estimatedAmount: 99999,
        actualAmount: 99999,
        isDeleted: true,
      },
    ];

    const payments = [
      { amount: 100000, status: 'Paid' },
      { amount: 140000, status: 'Paid' },
      { amount: 500000, status: 'Paid' },
      { amount: 50000, status: 'Paid', isDeleted: true }, // deleted payment ignored
    ];

    const contributions = [
      { familySide: 'Bride Family', amount: 500000 },
      { familySide: 'Groom Family', amount: 300000 },
    ];

    const res = calculateWeddingFinancials({
      totalBudget: 2000000,
      expenses,
      payments,
      contributions,
      weddingDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // ~3 months away
    });

    assert.strictEqual(res.totalEstimatedExpenses, 1600000);
    assert.strictEqual(res.totalActualExpenses, 1615000);
    assert.strictEqual(res.totalPaid, 740000);
    assert.strictEqual(res.totalOutstanding, 875000);
    assert.strictEqual(res.remainingBudget, 385000); // 2,000,000 - 1,615,000
    assert.strictEqual(res.budgetUtilization, 80.75); // 1,615,000 / 2,000,000 * 100
    assert.strictEqual(res.brideExpenses, 275000);
    assert.strictEqual(res.groomExpenses, 140000);
    assert.strictEqual(res.sharedExpenses, 1200000);
    assert.strictEqual(res.totalContributions, 800000);

    // Warning should trigger for >= 80%
    assert.strictEqual(res.warnings.length, 1);
    assert.strictEqual(res.warnings[0].code, 'BUDGET_NEAR_LIMIT');

    // Savings planner: net required = 1,615,000 - 800,000 = 815,000 across ~3 months
    assert.strictEqual(res.savingsPlanner.netRequiredFunding, 815000);
    assert.strictEqual(res.savingsPlanner.remainingMonths, 3);
    assert.strictEqual(res.savingsPlanner.monthlySavingsRequired, roundToTwoDecimals(815000 / 3));
  });

  test('budget exceeded triggers danger warning', () => {
    const expenses = [
      {
        name: 'Grand Venue',
        category: 'Venue',
        expenseOwner: 'Shared',
        actualAmount: 1100000,
      },
    ];

    const res = calculateWeddingFinancials({
      totalBudget: 1000000,
      expenses,
    });

    assert.strictEqual(res.budgetUtilization, 110);
    assert.strictEqual(res.remainingBudget, -100000);
    assert.strictEqual(res.warnings[0].code, 'BUDGET_EXCEEDED');
  });

  test('validates payment amounts against outstanding balance', () => {
    // Normal payment within balance
    const check1 = validatePaymentAmount(100000, 20000, 30000);
    assert.strictEqual(check1.valid, true);
    assert.strictEqual(check1.newTotalPaid, 50000);
    assert.strictEqual(check1.newOutstanding, 50000);

    // Overpayment blocked unless flag set
    const check2 = validatePaymentAmount(100000, 80000, 30000, false);
    assert.strictEqual(check2.valid, false);
    assert.ok(check2.error.includes('exceeds outstanding balance'));

    // Overpayment allowed if flag is true
    const check3 = validatePaymentAmount(100000, 80000, 30000, true);
    assert.strictEqual(check3.valid, true);

    // Zero or negative payment blocked
    const check4 = validatePaymentAmount(100000, 0, -500);
    assert.strictEqual(check4.valid, false);
  });

  test('calculates catering estimate correctly with service charges and taxes', () => {
    const catering = calculateCateringEstimate({
      adultCount: 200,
      childCount: 20,
      adultPlateCost: 4500,
      childPlateCost: 2500,
      serviceChargePercent: 10,
      vatPercent: 0,
      additionalCharges: 50000,
    });

    // 200 * 4500 = 900,000
    // 20 * 2500 = 50,000
    // Subtotal = 950,000
    // Service charge 10% = 95,000
    // Taxable = 950,000 + 95,000 + 50,000 = 1,095,000
    // Total = 1,095,000
    assert.strictEqual(catering.foodSubtotal, 950000);
    assert.strictEqual(catering.serviceCharge, 95000);
    assert.strictEqual(catering.totalCost, 1095000);
    assert.strictEqual(catering.totalGuests, 220);
    assert.strictEqual(catering.averageCostPerGuest, roundToTwoDecimals(1095000 / 220));
  });
});

