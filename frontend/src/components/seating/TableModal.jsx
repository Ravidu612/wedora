import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useWedding } from '../../contexts/WeddingContext';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';

export default function TableModal({ isOpen, onClose, table = null, onSuccess }) {
  const { activeWeddingId } = useWedding();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    tableNumber: '1',
    tableName: 'Table 1 - Head Table',
    capacity: 10,
    category: 'Head Table / VIP',
    tableType: 'Round',
    locationZone: 'Front Center',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (table) {
      setForm({
        tableNumber: table.tableNumber || '',
        tableName: table.tableName || '',
        capacity: table.capacity || 10,
        category: table.category || 'General',
        tableType: table.tableType || 'Round',
        locationZone: table.locationZone || 'Main Hall',
        notes: table.notes || '',
      });
    } else {
      setForm({
        tableNumber: '',
        tableName: '',
        capacity: 10,
        category: 'General',
        tableType: 'Round',
        locationZone: 'Main Hall',
        notes: '',
      });
    }
  }, [table, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tableNumber) {
      addToast('Please enter a table number or label.', 'warning');
      return;
    }

    try {
      setLoading(true);
      if (table?._id) {
        await api.put(`/weddings/${activeWeddingId}/tables/${table._id}`, form);
        addToast('Table updated successfully.', 'success');
      } else {
        await api.post(`/weddings/${activeWeddingId}/tables`, form);
        addToast('Table added to hall layout.', 'success');
      }

      onSuccess();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save table.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={table ? 'Edit Seating Table' : 'Add Table to Floor Plan'}
      subtitle="Configure table capacity and guest category"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Table # / ID"
            placeholder="e.g. 1, 2, VIP-1"
            required
            value={form.tableNumber}
            onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
          />
          <Input
            label="Max Seat Capacity"
            type="number"
            min={1}
            max={30}
            required
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
          />
        </div>

        <Input
          label="Table Name / Description"
          placeholder="e.g. Groom Closest Family, Colombo Batch"
          value={form.tableName}
          onChange={(e) => setForm({ ...form, tableName: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Table Group / Side"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={[
              'Head Table / VIP',
              'Bride Family',
              'Groom Family',
              'Bride Friends',
              'Groom Friends',
              'Relatives',
              'Colleagues',
              'General',
            ]}
          />

          <Select
            label="Table Shape"
            value={form.tableType}
            onChange={(e) => setForm({ ...form, tableType: e.target.value })}
            options={['Round', 'Rectangular', 'Square']}
          />
        </div>

        <Input
          label="Ballroom Location / Zone"
          placeholder="e.g. Near Stage, Left Wing, Entrance"
          value={form.locationZone}
          onChange={(e) => setForm({ ...form, locationZone: e.target.value })}
        />

        <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={loading}>
            {table ? 'Save Changes' : 'Create Table'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

