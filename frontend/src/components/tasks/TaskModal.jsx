import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useWedding } from '../../contexts/WeddingContext';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';

export default function TaskModal({ isOpen, onClose, task = null, onSuccess }) {
  const { activeWeddingId } = useWedding();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    description: '',
    timelineBucket: '6 Months Before',
    dueDate: '',
    priority: 'Medium',
    assignedTo: 'Shared',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        timelineBucket: task.timelineBucket || '6 Months Before',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        priority: task.priority || 'Medium',
        assignedTo: task.assignedTo || 'Shared',
        notes: task.notes || '',
      });
    } else {
      setForm({
        title: '',
        description: '',
        timelineBucket: '6 Months Before',
        dueDate: '',
        priority: 'Medium',
        assignedTo: 'Shared',
        notes: '',
      });
    }
  }, [task, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) {
      addToast('Please enter the task title.', 'warning');
      return;
    }

    try {
      setLoading(true);
      if (task?._id) {
        await api.put(`/weddings/${activeWeddingId}/tasks/${task._id}`, form);
        addToast('Task updated successfully.', 'success');
      } else {
        await api.post(`/weddings/${activeWeddingId}/tasks`, form);
        addToast('Task added to checklist.', 'success');
      }

      onSuccess();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save task.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Checklist Task' : 'Add New Task'}
      subtitle="Organize your wedding milestones and assign responsibilities"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          placeholder="e.g. Confirm wedding car & flower arrangements"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Milestone Timeline"
            value={form.timelineBucket}
            onChange={(e) => setForm({ ...form, timelineBucket: e.target.value })}
            options={[
              '12 Months Before',
              '9 Months Before',
              '6 Months Before',
              '3 Months Before',
              '1 Month Before',
              '1 Week Before',
              'Wedding Day',
              'Post Wedding',
            ]}
          />

          <Select
            label="Priority Level"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            options={['Low', 'Medium', 'High', 'Urgent']}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Assigned To"
            value={form.assignedTo}
            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            options={[
              { value: 'Shared', label: 'Shared (Both)' },
              { value: 'Bride', label: 'Bride' },
              { value: 'Groom', label: 'Groom' },
              { value: 'Bride Family', label: 'Bride Family' },
              { value: 'Groom Family', label: 'Groom Family' },
            ]}
          />

          <Input
            label="Due Date"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
        </div>

        <Input
          label="Notes / Instructions"
          placeholder="e.g. Check pickup address and driver contact"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={loading}>
            {task ? 'Save Changes' : 'Add Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

