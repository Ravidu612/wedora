import React, { useState } from 'react';
import { useWedding } from '../../contexts/WeddingContext';
import { formatCurrency } from '../../utils/currency';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import ExpenseModal from '../../components/budget/ExpenseModal';
import { Shirt, Plus, DollarSign, CreditCard } from 'lucide-react';

export default function GroomExpensesPage() {
  const { activeWedding, expenses, currency, refreshActiveWedding } = useWedding();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const groomExpenses = expenses.filter(
    (e) => !e.isDeleted && (e.expenseOwner === 'Groom' || e.expenseOwner === 'Groom Family')
  );

  const totalActual = groomExpenses.reduce((acc, e) => acc + (e.actualAmount || e.estimatedAmount || 0), 0);
  const totalPaid = groomExpenses.reduce((acc, e) => acc + (e.paidAmount || 0), 0);
  const outstanding = Math.max(0, totalActual - totalPaid);
  const allocatedBudget = activeWedding?.groomSideBudget || 1000000;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-champagne-100 text-champagne-800 text-xs font-semibold mb-1">
            <Shirt className="w-3.5 h-3.5" />
            <span>Dedicated Groom Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-textDark tracking-tight">
            Groom & Groomsmen Expenses
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Track Mul Anduma (Nilame attire), western bespoke suits, grooming, bestman attire, and homecoming in {currency}.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingExpense(null);
            setModalOpen(true);
          }}
          variant="primary"
          size="sm"
          icon={Plus}
        >
          Add Groom Expense
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Allocated Groom Budget"
          value={formatCurrency(allocatedBudget, currency)}
          subtext="Groom Side Target"
          icon={DollarSign}
        />
        <StatCard
          title="Actual Groom Expenses"
          value={formatCurrency(totalActual, currency)}
          badgeText={`${allocatedBudget > 0 ? ((totalActual / allocatedBudget) * 100).toFixed(0) : 0}%`}
          badgeType={totalActual > allocatedBudget ? 'danger' : 'gold'}
          subtext="Committed to Date"
          icon={Shirt}
        />
        <StatCard
          title="Advances Paid"
          value={formatCurrency(totalPaid, currency)}
          badgeText="Paid"
          badgeType="success"
          subtext="Verified Payments"
          icon={CreditCard}
        />
        <StatCard
          title="Outstanding Balance"
          value={formatCurrency(outstanding, currency)}
          badgeText={outstanding > 0 ? 'Pending' : 'Settled'}
          badgeType={outstanding > 0 ? 'warning' : 'success'}
          subtext="Remaining To Settle"
          icon={DollarSign}
        />
      </div>

      {/* Table */}
      {groomExpenses.length > 0 ? (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-ivory/80 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Side</th>
                  <th className="py-3 px-4">Actual Amount</th>
                  <th className="py-3 px-4">Paid</th>
                  <th className="py-3 px-4">Balance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {groomExpenses.map((exp) => {
                  const act = exp.actualAmount || exp.estimatedAmount || 0;
                  const paid = exp.paidAmount || 0;
                  const bal = Math.max(0, act - paid);

                  return (
                    <tr key={exp._id} className="hover:bg-stone-50/50">
                      <td className="py-3 px-4 font-bold text-stone-900">{exp.name}</td>
                      <td className="py-3 px-4 text-stone-600">{exp.category}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                          {exp.expenseOwner}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900">{formatCurrency(act, currency)}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-700">{formatCurrency(paid, currency)}</td>
                      <td className="py-3 px-4 text-stone-700">{formatCurrency(bal, currency)}</td>
                      <td className="py-3 px-4">
                        <Badge variant={exp.paymentStatus} size="sm">{exp.paymentStatus}</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setEditingExpense(exp);
                            setModalOpen(true);
                          }}
                          className="text-xs font-semibold text-champagne-700 hover:underline"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <EmptyState
          icon={Shirt}
          title="No Groom Expenses Logged"
          description="Track items like Kandyan Nilame Mul Anduma, tailored suits, leather shoes, grooming, and bestman outfits."
          actionText="Add First Groom Expense"
          onAction={() => {
            setEditingExpense(null);
            setModalOpen(true);
          }}
          actionIcon={Plus}
        />
      )}

      <ExpenseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        expense={editingExpense}
        onSuccess={refreshActiveWedding}
      />
    </div>
  );
}

