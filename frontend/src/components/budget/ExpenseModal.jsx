import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useWedding } from '../../contexts/WeddingContext';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';

export default function ExpenseModal({ isOpen, onClose, expense = null, onSuccess }) {
  const { activeWeddingId, currency } = useWedding();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    category: 'Venue & Reception Hall',
    estimatedAmount: '',
    quotedAmount: '',
    actualAmount: '',
    expenseOwner: 'Shared',
    payer: 'Shared',
    customPayerName: '',
    paymentDeadline: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      setForm({
        name: expense.name || '',
        category: expense.category || 'Venue & Reception Hall',
        estimatedAmount: expense.estimatedAmount || '',
        quotedAmount: expense.quotedAmount || '',
        actualAmount: expense.actualAmount || '',
        expenseOwner: expense.expenseOwner || 'Shared',
        payer: expense.payer || 'Shared',
        customPayerName: expense.customPayerName || '',
        paymentDeadline: expense.paymentDeadline ? expense.paymentDeadline.split('T')[0] : '',
        notes: expense.notes || '',
      });
    } else {
      setForm({
        name: '',
        category: 'Venue & Reception Hall',
        estimatedAmount: '',
        quotedAmount: '',
        actualAmount: '',
        expenseOwner: 'Shared',
        payer: 'Shared',
        customPayerName: '',
        paymentDeadline: '',
        notes: '',
      });
    }
  }, [expense, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category) {
      addToast('Please enter expense name and category.', 'warning');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...form,
        estimatedAmount: Number(form.estimatedAmount) || 0,
        quotedAmount: Number(form.quotedAmount) || 0,
        actualAmount: Number(form.actualAmount) || Number(form.estimatedAmount) || 0,
      };

      if (expense?._id) {
        await api.put(`/weddings/${activeWeddingId}/expenses/${expense._id}`, payload);
        addToast('Expense updated successfully.', 'success');
      } else {
        await api.post(`/weddings/${activeWeddingId}/expenses`, payload);
        addToast('Expense added successfully.', 'success');
      }

      onSuccess();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save expense.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Venue & Reception Hall',
    'Catering & Food',
    'Photography & Videography',
    'Bridal Dressing & Saree/Gown',
    'Groom Dressing & Nilame / Suit',
    'Jewellery & Rings',
    'Hair & Makeup Styling',
    'Decorations & Floral Design',
    'Poruwa Ceremony & Cultural Set',
    'Invitations & Stationery',
    'Wedding Cake & Structure',
    'Music, DJ & Traditional Drummers',
    'Transportation & Wedding Car',
    'Wedding Registration & Legal',
    'Gifts & Favours',
    'Homecoming Ceremony',
    'Honeymoon Package',
    'Emergency Contingency',
    'Other Miscellaneous',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={expense ? 'Edit Expense Item' : 'Add New Expense Item'}
      subtitle={`Enter financial details in ${currency}`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Expense Item Name"
          placeholder="e.g. Kandyan Osariya draper & stylist"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={categories}
          />

          <Select
            label="Expense Owner (Side)"
            value={form.expenseOwner}
            onChange={(e) => setForm({ ...form, expenseOwner: e.target.value })}
            options={[
              { value: 'Bride', label: 'Bride (Bridal Side)' },
              { value: 'Groom', label: 'Groom (Groom Side)' },
              { value: 'Bride Family', label: 'Bride Family' },
              { value: 'Groom Family', label: 'Groom Family' },
              { value: 'Shared', label: 'Shared / Both' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label={`Estimated (${currency})`}
            type="number"
            min={0}
            placeholder="0"
            value={form.estimatedAmount}
            onChange={(e) => setForm({ ...form, estimatedAmount: e.target.value })}
          />
          <Input
            label={`Quoted (${currency})`}
            type="number"
            min={0}
            placeholder="0"
            value={form.quotedAmount}
            onChange={(e) => setForm({ ...form, quotedAmount: e.target.value })}
          />
          <Input
            label={`Actual (${currency})`}
            type="number"
            min={0}
            placeholder="0"
            value={form.actualAmount}
            onChange={(e) => setForm({ ...form, actualAmount: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Payment Responsibility (Payer)"
            value={form.payer}
            onChange={(e) => setForm({ ...form, payer: e.target.value })}
            options={[
              { value: 'Shared', label: 'Shared (Couple)' },
              { value: 'Bride', label: 'Bride' },
              { value: 'Groom', label: 'Groom' },
              { value: 'Bride Family', label: 'Bride Family' },
              { value: 'Groom Family', label: 'Groom Family' },
              { value: 'Custom', label: 'Custom Individual' },
            ]}
          />

          <Input
            label="Payment Deadline"
            type="date"
            value={form.paymentDeadline}
            onChange={(e) => setForm({ ...form, paymentDeadline: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
            Notes / Vendor Details
          </label>
          <textarea
            rows={2}
            className="block w-full rounded-xl bg-white border border-stone-200 text-stone-900 text-xs p-3 focus:outline-none focus:border-champagne-500 focus:ring-2 focus:ring-champagne-200/50"
            placeholder="Contact numbers, package inclusions, terms..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={loading}>
            {expense ? 'Save Changes' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

