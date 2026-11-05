import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import api from '../../services/api';
import { User, Mail, Phone, Save } from 'lucide-react';

export default function UserProfilePage() {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    preferredCurrency: user?.preferredCurrency || 'LKR',
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put('/auth/profile', form);
      if (res.data.success) {
        updateUser(res.data.user);
        addToast('Profile updated successfully.', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-2xl">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <span className="text-xs font-semibold uppercase tracking-wider text-champagne-600">
          Account Details
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-textDark tracking-tight mt-1">
          User Profile
        </h1>
        <p className="text-xs text-textMuted mt-1">
          Manage your personal account settings and preferred currency.
        </p>
      </div>

      <Card title="Personal Information">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            icon={User}
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Input
            label="Email Address"
            icon={Mail}
            disabled
            helperText="Email cannot be changed"
            value={user?.email || ''}
          />

          <Input
            label="Phone Number"
            type="tel"
            icon={Phone}
            placeholder="+94 77 123 4567"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <Select
            label="Personal Default Currency"
            value={form.preferredCurrency}
            onChange={(e) => setForm({ ...form, preferredCurrency: e.target.value })}
            options={[
              { value: 'LKR', label: 'LKR (Sri Lankan Rupee)' },
              { value: 'USD', label: 'USD (US Dollar)' },
              { value: 'GBP', label: 'GBP (British Pound)' },
              { value: 'AUD', label: 'AUD (Australian Dollar)' },
              { value: 'AED', label: 'AED (UAE Dirham)' },
              { value: 'EUR', label: 'EUR (Euro)' },
            ]}
          />

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" size="md" isLoading={saving} icon={Save}>
              Save Profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

