import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWedding } from '../../contexts/WeddingContext';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import api from '../../services/api';
import { Settings, Save, Trash2, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const { activeWedding, updateActiveWedding, fetchWeddings } = useWedding();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    brideName: activeWedding?.brideName || '',
    groomName: activeWedding?.groomName || '',
    weddingDate: activeWedding?.weddingDate ? activeWedding.weddingDate.split('T')[0] : '',
    homecomingDate: activeWedding?.homecomingDate ? activeWedding.homecomingDate.split('T')[0] : '',
    location: activeWedding?.location || 'Colombo, Sri Lanka',
    venue: activeWedding?.venue || '',
    weddingType: activeWedding?.weddingType || 'Traditional Sri Lankan (Kandyan)',
    weddingTheme: activeWedding?.weddingTheme || 'Champagne Gold & Ivory',
    currency: activeWedding?.currency || 'LKR',
  });

  const [saving, setSaving] = useState(false);

  if (!activeWedding) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateActiveWedding(form);
    setSaving(false);
  };

  const handleDeleteWedding = async () => {
    const confirmation = window.prompt(
      `To permanently delete this wedding workspace and all records, type "${activeWedding.brideName}" below:`
    );

    if (confirmation === activeWedding.brideName) {
      try {
        await api.delete(`/weddings/${activeWedding._id}`);
        addToast('Wedding workspace deleted.', 'info');
        await fetchWeddings();
        navigate('/setup-wizard');
      } catch (err) {
        addToast(err.response?.data?.message || 'Failed to delete wedding workspace.', 'error');
      }
    } else if (confirmation !== null) {
      addToast('Name did not match. Workspace was NOT deleted.', 'warning');
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <span className="text-xs font-semibold uppercase tracking-wider text-champagne-600">
          Configuration
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-textDark tracking-tight mt-1">
          Wedding Settings
        </h1>
        <p className="text-xs text-textMuted mt-1">
          Update celebration dates, locations, currency formats, and workspace parameters.
        </p>
      </div>

      <Card title="Wedding Configuration">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Bride Full Name"
              required
              value={form.brideName}
              onChange={(e) => setForm({ ...form, brideName: e.target.value })}
            />
            <Input
              label="Groom Full Name"
              required
              value={form.groomName}
              onChange={(e) => setForm({ ...form, groomName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Wedding Date"
              type="date"
              required
              value={form.weddingDate}
              onChange={(e) => setForm({ ...form, weddingDate: e.target.value })}
            />
            <Input
              label="Homecoming Date"
              type="date"
              value={form.homecomingDate}
              onChange={(e) => setForm({ ...form, homecomingDate: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City / Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <Input
              label="Reception Hall / Venue"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Wedding Tradition / Style"
              value={form.weddingType}
              onChange={(e) => setForm({ ...form, weddingType: e.target.value })}
              options={[
                'Traditional Sri Lankan (Kandyan)',
                'Traditional Sri Lankan (Low Country)',
                'Western / Modern Nuptials',
                'Tamil Hindu Wedding',
                'Muslim Wedding Ceremony',
                'Fusion / Cross-Cultural Celebration',
              ]}
            />
            <Select
              label="Theme & Aesthetic"
              value={form.weddingTheme}
              onChange={(e) => setForm({ ...form, weddingTheme: e.target.value })}
              options={[
                'Champagne Gold & Ivory',
                'Royal Kandyan Maroon & Gold',
                'Botanical Blush & Sage',
                'Classic Modern White & Silver',
                'Tropical Lotus & Emerald',
              ]}
            />
            <Select
              label="System Currency"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              options={[
                { value: 'LKR', label: 'LKR (Sri Lankan Rupee)' },
                { value: 'USD', label: 'USD (US Dollar)' },
                { value: 'GBP', label: 'GBP (British Pound)' },
                { value: 'AUD', label: 'AUD (Australian Dollar)' },
                { value: 'AED', label: 'AED (UAE Dirham)' },
                { value: 'EUR', label: 'EUR (Euro)' },
              ]}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" size="md" isLoading={saving} icon={Save}>
              Save Workspace Settings
            </Button>
          </div>
        </form>
      </Card>

      {/* Danger Zone */}
      <Card className="border-rose-200 bg-rose-50/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Danger Zone</span>
            </div>
            <p className="text-xs text-rose-900/80 mt-1">
              Permanently delete this wedding workspace, expenses, and guest lists. This action cannot be undone.
            </p>
          </div>
          <Button onClick={handleDeleteWedding} variant="danger" size="sm" icon={Trash2}>
            Delete Workspace
          </Button>
        </div>
      </Card>
    </div>
  );
}

