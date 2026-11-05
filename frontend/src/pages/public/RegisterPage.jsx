import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { User, Mail, Lock, Phone, Heart, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    preferredCurrency: 'LKR',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in your name, email, and password.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const res = await register(formData);
    setLoading(false);

    if (res.success) {
      navigate('/setup-wizard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-champagne-100 border border-champagne-300 flex items-center justify-center text-champagne-600 shadow-sm">
              <Heart className="w-5 h-5 fill-champagne-500/20 text-champagne-600" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-textDark">
            Start Your Wedding Plan
          </h1>
          <p className="text-xs text-textMuted">
            Create an account to set up your collaborative wedding workspace.
          </p>
        </div>

        <Card className="shadow-premium border-stone-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              icon={User}
              placeholder="e.g. Senuri De Silva"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="senuri@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="At least 6 characters"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Phone (Optional)"
                type="tel"
                icon={Phone}
                placeholder="+94 77 123 4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <Select
                label="Currency"
                value={formData.preferredCurrency}
                onChange={(e) => setFormData({ ...formData, preferredCurrency: e.target.value })}
                options={[
                  { value: 'LKR', label: 'LKR (Rs. Sri Lanka)' },
                  { value: 'USD', label: 'USD ($ United States)' },
                  { value: 'GBP', label: 'GBP (£ United Kingdom)' },
                  { value: 'AUD', label: 'AUD (A$ Australia)' },
                  { value: 'AED', label: 'AED (Dirham UAE)' },
                  { value: 'EUR', label: 'EUR (€ Europe)' },
                ]}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
              icon={Sparkles}
            >
              Create Wedding Workspace
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-stone-100 text-center text-xs text-textMuted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-champagne-700 hover:text-champagne-900 underline">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

