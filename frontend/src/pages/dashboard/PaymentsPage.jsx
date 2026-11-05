import React, { useState } from 'react';
import { useWedding } from '../../contexts/WeddingContext';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import PaymentModal from '../../components/budget/PaymentModal';
import api from '../../services/api';
import { CreditCard, Plus, DollarSign, Trash2, CheckCircle2 } from 'lucide-react';

export default function PaymentsPage() {
  const { activeWeddingId, payments, financials, currency, refreshActiveWedding } = useWedding();
  const { addToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);

  const activePayments = payments.filter((p) => !p.isDeleted);

  const handleDeletePayment = async (id, amount) => {
    if (!window.confirm(`Are you sure you want to void this payment of ${formatCurrency(amount, currency)}? It will automatically restore the outstanding balance.`)) return;
    try {
      await api.delete(`/weddings/${activeWeddingId}/payments/${id}`);
      addToast('Payment reversed and deleted.', 'info');
      refreshActiveWedding();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete payment.', 'error');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-champagne-600">
            Payment Log
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-textDark tracking-tight mt-1">
            Payment Tracking & History
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Record advances, partial payments, and final settlements in {currency}.
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          variant="primary"
          size="sm"
          icon={Plus}
        >
          Record Payment
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Paid to Date"
          value={formatCurrency(financials?.totalPaid || 0, currency)}
          badgeText="Verified"
          badgeType="success"
          subtext="Total successful payments"
          icon={CreditCard}
        />
        <StatCard
          title="Outstanding to Pay"
          value={formatCurrency(financials?.totalOutstanding || 0, currency)}
          badgeText={financials?.totalOutstanding > 0 ? 'Pending' : 'Settled'}
          badgeType={financials?.totalOutstanding > 0 ? 'warning' : 'success'}
          subtext="Remaining contract balances"
          icon={DollarSign}
        />
        <StatCard
          title="Total Transactions"
          value={activePayments.length}
          subtext="Payment receipts logged"
          icon={CheckCircle2}
        />
      </div>

      {/* Table */}
      {activePayments.length > 0 ? (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-ivory/80 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                  <th className="py-3 px-4">Expense Item</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Payer Side</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Reference #</th>
                  <th className="py-3 px-4 text-right">Amount Paid</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {activePayments.map((p) => (
                  <tr key={p._id} className="hover:bg-stone-50/50">
                    <td className="py-3 px-4 font-bold text-stone-900">{p.expenseName || 'Direct Payment'}</td>
                    <td className="py-3 px-4 text-stone-600">{p.paymentMethod}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                        {p.payer}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-500">{formatDate(p.paymentDate)}</td>
                    <td className="py-3 px-4 text-stone-500 font-mono text-[11px]">{p.referenceNumber || '-'}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700 text-right">
                      {formatCurrency(p.amount, currency)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeletePayment(p._id, p.amount)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Void payment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <EmptyState
          icon={CreditCard}
          title="No Payments Logged"
          description="Record advance payments, hotel hall booking advances, or bridal salon deposits."
          actionText="Record First Payment"
          onAction={() => setModalOpen(true)}
          actionIcon={Plus}
        />
      )}

      <PaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={refreshActiveWedding}
      />
    </div>
  );
}

