import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { Mail, Lock, Heart, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please provide your email address and password.');
      return;
    }

    setLoading(true);
    const res = await login(formData.email, formData.password);
    setLoading(false);

    if (res.success) {
      if (res.currentWeddingId) {
        navigate(from, { replace: true });
      } else {
        navigate('/setup-wizard', { replace: true });
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-champagne-100 border border-champagne-300 flex items-center justify-center text-champagne-600 shadow-sm">
              <Heart className="w-5 h-5 fill-champagne-500/20 text-champagne-600" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-textDark">
            Welcome to Wedora
          </h1>
          <p className="text-xs text-textMuted">
            Sign in to access your wedding workspace and financial tracker.
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
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="bride_or_groom@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span />
                <Link
                  to="/forgot-password"
                  className="text-xs text-champagne-700 hover:text-champagne-900 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                label="Password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
              icon={ArrowRight}
            >
              Sign In to Wedding
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-stone-100 text-center text-xs text-textMuted">
            Planning a new wedding?{' '}
            <Link to="/register" className="font-semibold text-champagne-700 hover:text-champagne-900 underline">
              Create an account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

