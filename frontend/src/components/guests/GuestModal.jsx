import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useWedding } from '../../contexts/WeddingContext';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';

export default function GuestModal({ isOpen, onClose, guest = null, onSuccess }) {
  const { activeWeddingId } = useWedding();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'Relatives',
    group: 'Family & Friends',
    rsvpStatus: 'Pending',
    attendeesCount: 1,
    hasPlusOne: false,
    plusOneName: '',
    dietaryPreferences: 'Standard / Non-Veg',
    specialNotes: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (guest) {
      setForm({
        name: guest.name || '',
        phone: guest.phone || '',
        email: guest.email || '',
        category: guest.category || 'Relatives',
        group: guest.group || 'Family & Friends',
        rsvpStatus: guest.rsvpStatus || 'Pending',
        attendeesCount: guest.attendeesCount || 1,
        hasPlusOne: Boolean(guest.hasPlusOne),
        plusOneName: guest.plusOneName || '',
        dietaryPreferences: guest.dietaryPreferences || 'Standard / Non-Veg',
        specialNotes: guest.specialNotes || '',
      });
    } else {
      setForm({
        name: '',
        phone: '',
        email: '',
        category: 'Relatives',
        group: 'Family & Friends',
        rsvpStatus: 'Pending',
        attendeesCount: 1,
        hasPlusOne: false,
        plusOneName: '',
        dietaryPreferences: 'Standard / Non-Veg',
        specialNotes: '',
      });
    }
  }, [guest, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      addToast('Please enter the guest full name.', 'warning');
      return;
    }

    try {
      setLoading(true);
      if (guest?._id) {
        await api.put(`/weddings/${activeWeddingId}/guests/${guest._id}`, form);
        addToast('Guest updated successfully.', 'success');
      } else {
        await api.post(`/weddings/${activeWeddingId}/guests`, form);
        addToast('Guest added to list.', 'success');
      }

      onSuccess();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save guest.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'Bride Family', label: 'Bride Family' },
    { value: 'Groom Family', label: 'Groom Family' },
    { value: 'Bride Friends', label: 'Bride Friends' },
    { value: 'Groom Friends', label: 'Groom Friends' },
    { value: 'Relatives', label: 'Relatives' },
    { value: 'Colleagues', label: 'Colleagues & Work' },
    { value: 'VIP', label: 'VIP Guests' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={guest ? 'Edit Guest Details' : 'Add Guest to Wedding'}
      subtitle="Track RSVP response, plus-ones, and dietary preferences"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name / Family Name"
          placeholder="e.g. Mr. & Mrs. Ranasinghe"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Phone / WhatsApp"
            type="tel"
            placeholder="+94 77 123 4567"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="guest@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={categories}
          />

          <Select
            label="RSVP Status"
            value={form.rsvpStatus}
            onChange={(e) => setForm({ ...form, rsvpStatus: e.target.value })}
            options={[
              { value: 'Pending', label: 'Pending Response' },
              { value: 'Accepted', label: 'Accepted (Attending)' },
              { value: 'Declined', label: 'Declined' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Number of Attendees"
            type="number"
            min={1}
            value={form.attendeesCount}
            onChange={(e) => setForm({ ...form, attendeesCount: Number(e.target.value) })}
          />

          <Select
            label="Dietary Preferences"
            value={form.dietaryPreferences}
            onChange={(e) => setForm({ ...form, dietaryPreferences: e.target.value })}
            options={[
              { value: 'Standard / Non-Veg', label: 'Standard / Non-Veg' },
              { value: 'Vegetarian', label: 'Vegetarian' },
              { value: 'Vegan', label: 'Vegan' },
              { value: 'Halal', label: 'Halal' },
              { value: 'No Seafood', label: 'No Seafood' },
              { value: 'Other / Special', label: 'Other / Special' },
            ]}
          />
        </div>

        <Input
          label="Special Notes / Table Preference"
          placeholder="e.g. Needs high chair for toddler"
          value={form.specialNotes}
          onChange={(e) => setForm({ ...form, specialNotes: e.target.value })}
        />

        <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={loading}>
            {guest ? 'Save Changes' : 'Add Guest'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

