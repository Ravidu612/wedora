import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useWedding } from '../../contexts/WeddingContext';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';

export default function VendorModal({ isOpen, onClose, vendor = null, onSuccess }) {
  const { activeWeddingId, currency } = useWedding();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    category: 'Photography',
    contactPerson: '',
    phone: '',
    email: '',
    quotedAmount: '',
    contractAmount: '',
    advancePaid: '',
    bookingStatus: 'Not Contacted',
    paymentDeadline: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vendor) {
      setForm({
        name: vendor.name || '',
        category: vendor.category || 'Photography',
        contactPerson: vendor.contactPerson || '',
        phone: vendor.phone || '',
        email: vendor.email || '',
        quotedAmount: vendor.quotedAmount || '',
        contractAmount: vendor.contractAmount || '',
        advancePaid: vendor.advancePaid || '',
        bookingStatus: vendor.bookingStatus || 'Not Contacted',
        paymentDeadline: vendor.paymentDeadline ? vendor.paymentDeadline.split('T')[0] : '',
        notes: vendor.notes || '',
      });
    } else {
      setForm({
        name: '',
        category: 'Photography',
        contactPerson: '',
        phone: '',
        email: '',
        quotedAmount: '',
        contractAmount: '',
        advancePaid: '',
        bookingStatus: 'Not Contacted',
        paymentDeadline: '',
        notes: '',
      });
    }
  }, [vendor, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category) {
      addToast('Please enter vendor name and category.', 'warning');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...form,
        quotedAmount: Number(form.quotedAmount) || 0,
        contractAmount: Number(form.contractAmount) || 0,
        advancePaid: Number(form.advancePaid) || 0,
      };

      if (vendor?._id) {
        await api.put(`/weddings/${activeWeddingId}/vendors/${vendor._id}`, payload);
        addToast('Vendor updated successfully.', 'success');
      } else {
        await api.post(`/weddings/${activeWeddingId}/vendors`, payload);
        addToast('Vendor added to directory.', 'success');
      }

      onSuccess();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save vendor.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Hotels & Reception Halls',
    'Photography',
    'Videography',
    'Bridal Dressing & Salon',
    'Groom Dressing',
    'Catering',
    'Decorations & Florists',
    'Poruwa & Cultural Items',
    'Cake Suppliers',
    'Music, DJ & Band',
    'Wedding Planners',
    'Transport & Vehicles',
    'Jewellery Shops',
    'Invitations & Stationery',
    'Other',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vendor ? 'Edit Vendor' : 'Add New Vendor'}
      subtitle={`Track contracts, quotes, and advance payments in ${currency}`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Vendor / Business Name"
          placeholder="e.g. Studio 3000 Photography, Lassana Flora"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Service Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={categories}
          />

          <Select
            label="Booking Status"
            value={form.bookingStatus}
            onChange={(e) => setForm({ ...form, bookingStatus: e.target.value })}
            options={[
              'Not Contacted',
              'Contacted',
              'Quotation Received',
              'Negotiating',
              'Booked',
              'Cancelled',
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Contact Person"
            placeholder="e.g. Priyantha"
            value={form.contactPerson}
            onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="+94 77 123 4567"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="vendor@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label={`Quotation (${currency})`}
            type="number"
            min={0}
            placeholder="0"
            value={form.quotedAmount}
            onChange={(e) => setForm({ ...form, quotedAmount: e.target.value })}
          />
          <Input
            label={`Final Contract (${currency})`}
            type="number"
            min={0}
            placeholder="0"
            value={form.contractAmount}
            onChange={(e) => setForm({ ...form, contractAmount: e.target.value })}
          />
          <Input
            label={`Advance Paid (${currency})`}
            type="number"
            min={0}
            placeholder="0"
            value={form.advancePaid}
            onChange={(e) => setForm({ ...form, advancePaid: e.target.value })}
          />
        </div>

        <Input
          label="Payment Balance Deadline"
          type="date"
          value={form.paymentDeadline}
          onChange={(e) => setForm({ ...form, paymentDeadline: e.target.value })}
        />

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
            Deliverables & Contract Terms
          </label>
          <textarea
            rows={2}
            className="block w-full rounded-xl bg-white border border-stone-200 text-stone-900 text-xs p-3 focus:outline-none focus:border-champagne-500 focus:ring-2 focus:ring-champagne-200/50"
            placeholder="Album specifications, hours of coverage, inclusions..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={loading}>
            {vendor ? 'Save Changes' : 'Add Vendor'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

