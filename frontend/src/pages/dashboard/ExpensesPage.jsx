import React, { useState } from 'react';
import { useWedding } from '../../contexts/WeddingContext';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import ExpenseModal from '../../components/budget/ExpenseModal';
import PaymentModal from '../../components/budget/PaymentModal';
import api from '../../services/api';
import {
  Plus,
  Search,
  Filter,
  Receipt,
  DollarSign,
  CreditCard,
  Trash2,
  Edit,
  Clock,
} from 'lucide-react';

export default function ExpensesPage() {
  const { activeWeddingId, expenses, financials, currency, refreshActiveWedding } = useWedding();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [ownerFilter, setOwnerFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [targetExpenseForPayment, setTargetExpenseForPayment] = useState(null);

  const filteredExpenses = expenses.filter((e) => {
    if (e.isDeleted) return false;
    const matchSearch = (e.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.notes || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || e.category === categoryFilter;
    const matchOwner = ownerFilter === 'All' || e.expenseOwner === ownerFilter;
    const matchStatus = statusFilter === 'All' || e.paymentStatus === statusFilter;
    return matchSearch && matchCat && matchOwner && matchStatus;
  });

  const handleDeleteExpense = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.delete(`/weddings/${activeWeddingId}/expenses/${id}`);
      addToast('Expense removed.', 'info');
      refreshActiveWedding();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete expense.', 'error');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-champagne-600">
            Expenditure Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-textDark tracking-tight mt-1">
            All Wedding Expenses
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Track quotations, actual balances, and assign payment responsibilities in {currency}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setEditingExpense(null);
              setExpenseModalOpen(true);
            }}
            variant="primary"
            size="sm"
            icon={Plus}
          >
            Add Expense
          </Button>
        </div>
      </div>

      {/* KPI summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Actual Expenses"
          value={formatCurrency(financials?.totalActualExpenses || 0, currency)}
          subtext="Sum of all active items"
          icon={Receipt}
        />
        <StatCard
          title="Total Paid to Date"
          value={formatCurrency(financials?.totalPaid || 0, currency)}
          badgeText="Paid"
          badgeType="success"
          subtext="Deposits & advances"
          icon={CreditCard}
        />
        <StatCard
          title="Outstanding Balance"
          value={formatCurrency(financials?.totalOutstanding || 0, currency)}
          badgeText="Pending"
          badgeType="warning"
          subtext="Remaining vendor balance"
          icon={DollarSign}
        />
      </div>

      {/* Filters Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <Input
            placeholder="Search expense or notes..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Sides (Ownership)' },
              { value: 'Bride', label: 'Bride Side' },
              { value: 'Groom', label: 'Groom Side' },
              { value: 'Bride Family', label: 'Bride Family' },
              { value: 'Groom Family', label: 'Groom Family' },
              { value: 'Shared', label: 'Shared / Reception' },
            ]}
          />

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Payment Statuses' },
              { value: 'Unpaid', label: 'Unpaid' },
              { value: 'Partially Paid', label: 'Partially Paid' },
              { value: 'Paid', label: 'Fully Paid' },
              { value: 'Overdue', label: 'Overdue' },
            ]}
          />

          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Categories' },
              ...(financials?.categoryBreakdown || []).map((c) => ({
                value: c.name,
                label: c.name,
              })),
            ]}
          />
        </div>
      </Card>

      {/* Expenses Table */}
      {filteredExpenses.length > 0 ? (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-ivory/80 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                  <th className="py-3.5 px-4">Expense Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Side (Owner)</th>
                  <th className="py-3.5 px-4">Actual Amount</th>
                  <th className="py-3.5 px-4">Paid</th>
                  <th className="py-3.5 px-4">Balance</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredExpenses.map((exp) => {
                  const actual = exp.actualAmount || exp.estimatedAmount || 0;
                  const paid = exp.paidAmount || 0;
                  const balance = Math.max(0, actual - paid);

                  return (
                    <tr key={exp._id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        {exp.name}
                        {exp.paymentDeadline && (
                          <div className="text-[10px] text-stone-400 font-normal flex items-center gap-1 mt-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            <span>Due: {formatDate(exp.paymentDeadline)}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">{exp.category}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-md text-[11px]">
                          {exp.expenseOwner}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        {formatCurrency(actual, currency)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-emerald-700">
                        {formatCurrency(paid, currency)}
                      </td>
                      <td className="py-3.5 px-4 text-stone-700 font-medium">
                        {formatCurrency(balance, currency)}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={exp.paymentStatus} size="sm">
                          {exp.paymentStatus}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {balance > 0 && (
                            <button
                              onClick={() => {
                                setTargetExpenseForPayment(exp);
                                setPaymentModalOpen(true);
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                            >
                              Pay
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditingExpense(exp);
                              setExpenseModalOpen(true);
                            }}
                            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg"
                            title="Edit expense"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(exp._id, exp.name)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete expense"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
          icon={Receipt}
          title="No Expenses Found"
          description="No expenses match your search or filters. Click below to add your first expense."
          actionText="Add New Expense"
          onAction={() => {
            setEditingExpense(null);
            setExpenseModalOpen(true);
          }}
          actionIcon={Plus}
        />
      )}

      {/* Modals */}
      <ExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        expense={editingExpense}
        onSuccess={refreshActiveWedding}
      />

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false);
          setTargetExpenseForPayment(null);
        }}
        expense={targetExpenseForPayment}
        onSuccess={refreshActiveWedding}
      />
    </div>
  );
}

