import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetComplete, setResetComplete] = useState(false);
  const [error, setError] = useState('');

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your registered email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setSubmitted(true);
        if (res.data.resetToken) {
          setResetToken(res.data.resetToken);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request reset token.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/reset-password', {
        token: resetToken,
        newPassword,
      });
      if (res.data.success) {
        setResetComplete(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <Card className="shadow-premium">
          <div className="mb-4">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-textMuted hover:text-textDark font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>

          <h2 className="text-xl font-serif font-bold text-textDark mb-1">
            {resetComplete
              ? 'Password Updated!'
              : submitted
              ? 'Reset Your Password'
              : 'Forgot Password'}
          </h2>
          <p className="text-xs text-textMuted mb-6">
            {resetComplete
              ? 'Your password has been changed successfully. You can now log in.'
              : submitted
              ? 'Enter your new password below to regain access to your wedding workspace.'
              : "Enter your account's email address and we'll generate your password reset link."}
          </p>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium mb-4">
              {error}
            </div>
          )}

          {resetComplete ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <Link to="/login" className="block">
                <Button variant="primary" size="md" className="w-full">
                  Sign In Now
                </Button>
              </Link>
            </div>
          ) : submitted ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <Input
                label="New Password"
                type="password"
                placeholder="Minimum 6 characters"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
                Update Password
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="bride_or_groom@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
                Generate Reset Link
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

