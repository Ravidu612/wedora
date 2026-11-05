import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useWedding } from '../../contexts/WeddingContext';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency } from '../../utils/currency';
import api from '../../services/api';

export default function PaymentModal({ isOpen, onClose, expense = null, onSuccess }) {
  const { activeWeddingId, currency, expenses } = useWedding();
  const { addToast } = useToast();

  const [selectedExpenseId, setSelectedExpenseId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [payer, setPayer] = useState('Shared');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [allowOverpayment, setAllowOverpayment] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      setSelectedExpenseId(expense._id);
      const actual = expense.actualAmount || expense.estimatedAmount || 0;
      const outstanding = Math.max(0, actual - (expense.paidAmount || 0));
      setAmount(outstanding > 0 ? outstanding.toString() : '');
      setPayer(expense.payer || 'Shared');
    } else {
      setSelectedExpenseId('');
      setAmount('');
      setPayer('Shared');
    }
  }, [expense, isOpen]);

  const activeExpense = expenses.find((e) => e._id === selectedExpenseId) || expense;
  const currentActual = activeExpense?.actualAmount || activeExpense?.estimatedAmount || 0;
  const currentPaid = activeExpense?.paidAmount || 0;
  const currentOutstanding = Math.max(0, currentActual - currentPaid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      addToast('Please enter a payment amount greater than zero.', 'warning');
      return;
    }

    if (!allowOverpayment && numAmount > currentOutstanding && currentOutstanding > 0) {
      addToast(`Payment exceeds outstanding balance of ${formatCurrency(currentOutstanding, currency)}. Check overpayment box if intentional.`, 'warning');
      return;
    }

    try {
      setLoading(true);
      await api.post(`/weddings/${activeWeddingId}/payments`, {
        expenseId: selectedExpenseId || null,
        amount: numAmount,
        paymentDate,
        paymentMethod,
        payer,
        referenceNumber,
        notes,
        allowOverpayment,
      });

      addToast('Payment recorded successfully.', 'success');
      onSuccess();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to record payment.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Payment"
      subtitle="Log an advance, deposit, or final payment settlement"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {activeExpense ? (
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
            <div className="font-semibold text-textDark">{activeExpense.name}</div>
            <div className="flex justify-between text-textMuted">
              <span>Total Quoted/Actual:</span>
              <span className="font-bold text-stone-900">{formatCurrency(currentActual, currency)}</span>
            </div>
            <div className="flex justify-between text-textMuted">
              <span>Already Paid:</span>
              <span className="font-bold text-emerald-700">{formatCurrency(currentPaid, currency)}</span>
            </div>
            <div className="flex justify-between text-textMuted border-t border-stone-200/60 pt-1">
              <span>Outstanding Balance:</span>
              <span className="font-bold text-champagne-800">{formatCurrency(currentOutstanding, currency)}</span>
            </div>
          </div>
        ) : (
          <Select
            label="Linked Expense (Optional)"
            value={selectedExpenseId}
            onChange={(e) => {
              setSelectedExpenseId(e.target.value);
              const target = expenses.find((x) => x._id === e.target.value);
              if (target) {
                const act = target.actualAmount || target.estimatedAmount || 0;
                const out = Math.max(0, act - (target.paidAmount || 0));
                setAmount(out > 0 ? out.toString() : '');
              }
            }}
            options={[
              { value: '', label: '-- Direct Payment (No specific expense) --' },
              ...expenses.map((exp) => ({
                value: exp._id,
                label: `${exp.name} (Outstanding: ${formatCurrency(Math.max(0, (exp.actualAmount || exp.estimatedAmount) - (exp.paidAmount || 0)), currency)})`,
              })),
            ]}
          />
        )}

        <Input
          label={`Payment Amount (${currency})`}
          type="number"
          min={0.01}
          step="any"
          required
          placeholder="e.g. 50000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={[
              'Bank Transfer',
              'Cash',
              'Card',
              'Online Payment',
              'Cheque',
              'Other',
            ]}
          />

          <Input
            label="Payment Date"
            type="date"
            required
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Payer Side"
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
            options={[
              { value: 'Shared', label: 'Shared' },
              { value: 'Bride', label: 'Bride' },
              { value: 'Groom', label: 'Groom' },
              { value: 'Bride Family', label: 'Bride Family' },
              { value: 'Groom Family', label: 'Groom Family' },
            ]}
          />

          <Input
            label="Reference # / Slip"
            placeholder="e.g. TXN-94812"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
          />
        </div>

        {activeExpense && Number(amount) > currentOutstanding && (
          <label className="flex items-center gap-2 text-xs text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200 cursor-pointer">
            <input
              type="checkbox"
              checked={allowOverpayment}
              onChange={(e) => setAllowOverpayment(e.target.checked)}
              className="rounded text-champagne-600 focus:ring-champagne-500"
            />
            <span>Allow payment exceeding recorded outstanding amount</span>
          </label>
        )}

        <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={loading}>
            Confirm Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
}

