import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useWedding } from '../../contexts/WeddingContext';
import { useToast } from '../../contexts/ToastContext';
import confetti from 'canvas-confetti';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import {
  Sparkles,
  Heart,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export default function WeddingSetupWizard() {
  const navigate = useNavigate();
  const { fetchWeddings, selectWedding } = useWedding();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    brideName: '',
    groomName: '',
    weddingDate: '',
    homecomingDate: '',
    location: 'Colombo, Sri Lanka',
    venue: '',
    weddingType: 'Traditional Sri Lankan (Kandyan)',
    weddingTheme: 'Champagne Gold & Ivory',
    estimatedGuestCount: 200,
    totalBudget: 2500000,
    brideSideBudget: 1000000,
    groomSideBudget: 1000000,
    sharedBudget: 500000,
    currency: 'LKR',
    notes: '',
  });

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1 && (!form.brideName || !form.groomName || !form.weddingDate)) {
      addToast('Please enter bride name, groom name, and wedding date.', 'warning');
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleComplete = async () => {
    try {
      setLoading(true);
      const res = await api.post('/weddings', form);
      if (res.data.success) {
        addToast('Wedding workspace created! Initializing categories and checklist...', 'success');

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C9A46A', '#E8D5D0', '#FAF7F2'],
        });

        await fetchWeddings();
        selectWedding(res.data.wedding._id);

        navigate('/dashboard');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create wedding workspace.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pageBg py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Progress Tracker */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 p-2 rounded-2xl bg-champagne-50 border border-champagne-200 text-champagne-700 text-xs font-semibold mb-2">
            <Heart className="w-4 h-4 fill-champagne-500/20" />
            <span>Step {step} of 3 • Setup Wizard</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-textDark">
            {step === 1 && "Tell Us About the Couple"}
            {step === 2 && "Ceremony & Location"}
            {step === 3 && "Budget & Guest Targets"}
          </h1>
          <p className="text-xs text-textMuted">
            You can always modify these details later in your Wedding Settings.
          </p>
        </div>

        <Card className="shadow-premium border-stone-200 p-8">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Bride Full Name"
                  placeholder="e.g. Senuri De Silva"
                  required
                  value={form.brideName}
                  onChange={(e) => setForm({ ...form, brideName: e.target.value })}
                />
                <Input
                  label="Groom Full Name"
                  placeholder="e.g. Kavinda Perera"
                  required
                  value={form.groomName}
                  onChange={(e) => setForm({ ...form, groomName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Main Wedding Date"
                  type="date"
                  required
                  value={form.weddingDate}
                  onChange={(e) => setForm({ ...form, weddingDate: e.target.value })}
                />
                <Input
                  label="Homecoming Date (Optional)"
                  type="date"
                  helperText="Common for Sri Lankan traditions"
                  value={form.homecomingDate}
                  onChange={(e) => setForm({ ...form, homecomingDate: e.target.value })}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button onClick={handleNext} variant="primary" icon={ArrowRight}>
                  Continue to Ceremony Details
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Wedding Location / City"
                  icon={MapPin}
                  placeholder="e.g. Colombo, Kandy, Galle"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
                <Input
                  label="Main Venue / Ballroom"
                  placeholder="e.g. Cinnamon Grand, Galle Face Hotel"
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Wedding Tradition / Style"
                  value={form.weddingType}
                  onChange={(e) => setForm({ ...form, weddingType: e.target.value })}
                  options={[
                    { value: 'Traditional Sri Lankan (Kandyan)', label: 'Traditional Sri Lankan (Kandyan)' },
                    { value: 'Traditional Sri Lankan (Low Country)', label: 'Traditional Sri Lankan (Low Country)' },
                    { value: 'Western / Modern Nuptials', label: 'Western / Modern Nuptials' },
                    { value: 'Tamil Hindu Wedding', label: 'Tamil Hindu Wedding' },
                    { value: 'Muslim Wedding Ceremony', label: 'Muslim Wedding Ceremony' },
                    { value: 'Fusion / Cross-Cultural Celebration', label: 'Fusion / Cross-Cultural Celebration' },
                  ]}
                />
                <Select
                  label="Wedding Theme & Palette"
                  value={form.weddingTheme}
                  onChange={(e) => setForm({ ...form, weddingTheme: e.target.value })}
                  options={[
                    { value: 'Champagne Gold & Ivory', label: 'Champagne Gold & Ivory (Signature)' },
                    { value: 'Royal Kandyan Maroon & Gold', label: 'Royal Kandyan Maroon & Gold' },
                    { value: 'Botanical Blush & Sage', label: 'Botanical Blush & Sage' },
                    { value: 'Classic Modern White & Silver', label: 'Classic Modern White & Silver' },
                    { value: 'Tropical Lotus & Emerald', label: 'Tropical Lotus & Emerald' },
                  ]}
                />
              </div>

              <div className="pt-4 flex justify-between">
                <Button onClick={() => setStep(1)} variant="outline" icon={ArrowLeft}>
                  Back
                </Button>
                <Button onClick={handleNext} variant="primary" icon={ArrowRight}>
                  Continue to Budget Targets
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Estimated Guest Count"
                  type="number"
                  icon={Users}
                  min={1}
                  value={form.estimatedGuestCount}
                  onChange={(e) => setForm({ ...form, estimatedGuestCount: Number(e.target.value) })}
                />
                <Select
                  label="Currency"
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

              <Input
                label={`Total Allocated Wedding Budget (${form.currency})`}
                type="number"
                min={0}
                icon={DollarSign}
                value={form.totalBudget}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setForm({
                    ...form,
                    totalBudget: val,
                    brideSideBudget: Math.round(val * 0.4),
                    groomSideBudget: Math.round(val * 0.4),
                    sharedBudget: Math.round(val * 0.2),
                  });
                }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <Input
                  label="Bride Side Budget"
                  type="number"
                  value={form.brideSideBudget}
                  onChange={(e) => setForm({ ...form, brideSideBudget: Number(e.target.value) })}
                />
                <Input
                  label="Groom Side Budget"
                  type="number"
                  value={form.groomSideBudget}
                  onChange={(e) => setForm({ ...form, groomSideBudget: Number(e.target.value) })}
                />
                <Input
                  label="Shared Budget"
                  type="number"
                  value={form.sharedBudget}
                  onChange={(e) => setForm({ ...form, sharedBudget: Number(e.target.value) })}
                />
              </div>

              <div className="pt-4 flex justify-between">
                <Button onClick={() => setStep(2)} variant="outline" icon={ArrowLeft}>
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  variant="primary"
                  isLoading={loading}
                  icon={Sparkles}
                >
                  Launch Wedding Workspace
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

