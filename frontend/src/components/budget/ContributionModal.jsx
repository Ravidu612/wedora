import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useWedding } from '../../contexts/WeddingContext';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';

export default function ContributionModal({ isOpen, onClose, onSuccess }) {
  const { activeWeddingId, currency } = useWedding();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    contributorName: '',
    familySide: 'Bride Family',
    amount: '',
    contributionDate: new Date().toISOString().split('T')[0],
    contributionType: 'Cash',
    contributionMethod: 'Direct Gift',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.contributorName || !form.amount || Number(form.amount) <= 0) {
      addToast('Please enter contributor name and amount.', 'warning');
      return;
    }

    try {
      setLoading(true);
      await api.post(`/weddings/${activeWeddingId}/contributions`, {
        ...form,
        amount: Number(form.amount),
      });

      addToast('Family contribution recorded!', 'success');
      onSuccess();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to record contribution.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Family Contribution"
      subtitle="Contributions are tracked as funding received and do NOT count as expenses"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Contributor Name / Relation"
          placeholder="e.g. Uncle Nimal, Grandmother"
          required
          value={form.contributorName}
          onChange={(e) => setForm({ ...form, contributorName: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Family Side"
            value={form.familySide}
            onChange={(e) => setForm({ ...form, familySide: e.target.value })}
            options={[
              { value: 'Bride Family', label: 'Bride Family' },
              { value: 'Groom Family', label: 'Groom Family' },
              { value: 'Bride', label: 'Bride (Personal Savings)' },
              { value: 'Groom', label: 'Groom (Personal Savings)' },
              { value: 'Shared', label: 'Joint Couple Savings' },
              { value: 'Other', label: 'Other Relative' },
            ]}
          />

          <Input
            label={`Amount (${currency})`}
            type="number"
            min={1}
            required
            placeholder="e.g. 200000"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Contribution Type"
            value={form.contributionType}
            onChange={(e) => setForm({ ...form, contributionType: e.target.value })}
            options={['Cash', 'Bank Transfer', 'Gold / Jewellery', 'Cheque', 'Gift', 'Other']}
          />

          <Input
            label="Date Received"
            type="date"
            value={form.contributionDate}
            onChange={(e) => setForm({ ...form, contributionDate: e.target.value })}
          />
        </div>

        <Input
          label="Notes / Special Blessings"
          placeholder="e.g. For jewellery purchase or reception banquet"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={loading}>
            Save Contribution
          </Button>
        </div>
      </form>
    </Modal>
  );
}

