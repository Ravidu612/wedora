import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useWedding } from '../../contexts/WeddingContext';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';

export default function TimelineModal({ isOpen, onClose, item = null, onSuccess }) {
  const { activeWeddingId } = useWedding();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    startTime: '09:00 AM',
    endTime: '09:30 AM',
    location: 'Main Ballroom',
    responsiblePerson: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setForm({
        title: item.title || '',
        startTime: item.startTime || '09:00 AM',
        endTime: item.endTime || '09:30 AM',
        location: item.location || 'Main Ballroom',
        responsiblePerson: item.responsiblePerson || '',
        notes: item.notes || '',
      });
    } else {
      setForm({
        title: '',
        startTime: '09:00 AM',
        endTime: '09:30 AM',
        location: 'Main Ballroom',
        responsiblePerson: '',
        notes: '',
      });
    }
  }, [item, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.startTime) {
      addToast('Please enter event title and start time.', 'warning');
      return;
    }

    try {
      setLoading(true);
      if (item?._id) {
        await api.put(`/weddings/${activeWeddingId}/timeline/${item._id}`, form);
        addToast('Timeline item updated.', 'success');
      } else {
        await api.post(`/weddings/${activeWeddingId}/timeline`, form);
        addToast('Timeline event added.', 'success');
      }

      onSuccess();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save timeline event.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Edit Timeline Event' : 'Add Event to Itinerary'}
      subtitle="Coordinate Auspicious Nekath times and ceremony events"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Event Name"
          placeholder="e.g. Auspicious Poruwa Ceremony (Nekath)"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Time"
            placeholder="e.g. 09:15 AM"
            required
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          />
          <Input
            label="End Time"
            placeholder="e.g. 10:00 AM"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Location / Stage"
            placeholder="e.g. Poruwa Stage / Ballroom"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <Input
            label="Responsible Person / MC"
            placeholder="e.g. Best Man, Astaka"
            value={form.responsiblePerson}
            onChange={(e) => setForm({ ...form, responsiblePerson: e.target.value })}
          />
        </div>

        <Input
          label="Notes / Instructions"
          placeholder="e.g. Ensure betel leaves and oil lamp ready"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={loading}>
            {item ? 'Save Changes' : 'Add to Schedule'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

