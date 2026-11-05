import React, { useState, useEffect } from 'react';
import { useWedding } from '../../contexts/WeddingContext';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import api from '../../services/api';
import {
  Mail,
  Sparkles,
  Share2,
  ExternalLink,
  Copy,
  Eye,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Heart,
} from 'lucide-react';
import { formatDate } from '../../utils/date';

export default function InvitationsPage() {
  const { activeWeddingId, activeWedding } = useWedding();
  const { addToast } = useToast();

  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    template: 'royal-kandyan',
    title: 'The Wedding Celebration',
    customMessage: 'Together with their families, invite you to share in the joy of their wedding celebration.',
    brideName: '',
    groomName: '',
    weddingDate: '',
    venue: '',
    location: '',
    dressCode: 'Traditional / Formal',
    accentColor: '#C9A46A',
    fontFamily: 'Playfair Display',
    isRSVPEnabled: true,
    allowPlusOne: true,
  });

  const fetchInvitation = async () => {
    if (!activeWeddingId) return;
    try {
      setLoading(true);
      const res = await api.get(`/invitations/${activeWeddingId}/invitations`);
      if (res.data.success) {
        const inv = res.data.invitation;
        setInvitation(inv);
        setForm({
          template: inv.template || 'royal-kandyan',
          title: inv.title || 'The Wedding Celebration',
          customMessage: inv.customMessage || '',
          brideName: inv.brideName || activeWedding?.brideName || '',
          groomName: inv.groomName || activeWedding?.groomName || '',
          weddingDate: inv.weddingDate ? inv.weddingDate.split('T')[0] : '',
          venue: inv.venue || activeWedding?.venue || '',
          location: inv.location || activeWedding?.location || '',
          dressCode: inv.dressCode || 'Traditional / Formal',
          accentColor: inv.accentColor || '#C9A46A',
          fontFamily: inv.fontFamily || 'Playfair Display',
          isRSVPEnabled: inv.isRSVPEnabled !== false,
          allowPlusOne: inv.allowPlusOne !== false,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitation();
  }, [activeWeddingId]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put(`/invitations/${activeWeddingId}/invitations`, form);
      if (res.data.success) {
        setInvitation(res.data.invitation);
        addToast('Invitation design saved successfully.', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save invitation.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const inviteUrl = invitation ? `${window.location.origin}/invite/${invitation.slug}` : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    addToast('Invitation URL copied to clipboard!', 'success');
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `You're cordially invited to the wedding celebration of ${form.brideName} & ${form.groomName}! View invitation & RSVP here: ${inviteUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-champagne-600">
            Stationery & Digital Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-textDark tracking-tight mt-1">
            Digital Wedding Invitation
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Design, preview, and share your personalized interactive digital invitation link.
          </p>
        </div>

        {invitation && (
          <div className="flex items-center gap-2">
            <Button onClick={handleCopyLink} variant="outline" size="sm" icon={Copy}>
              Copy Link
            </Button>
            <Button onClick={handleWhatsAppShare} variant="gold-outline" size="sm" icon={Share2}>
              WhatsApp Share
            </Button>
            <a href={`/invite/${invitation.slug}`} target="_blank" rel="noreferrer">
              <Button variant="primary" size="sm" icon={ExternalLink}>
                Preview Live
              </Button>
            </a>
          </div>
        )}
      </div>

      {/* Shareable Link Banner */}
      {invitation && (
        <div className="bg-ivory rounded-2xl p-4 border border-champagne-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700">Public Invitation URL:</span>
            <code className="bg-white px-2.5 py-1 rounded-lg border border-stone-200 text-champagne-800 font-mono">
              {inviteUrl}
            </code>
          </div>
          <span className="text-stone-500 font-medium">
            Total Views: <strong className="text-stone-900">{invitation.viewsCount || 0}</strong>
          </span>
        </div>
      )}

      {/* Editor & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Design Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card title="Invitation Customization">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Invitation Theme Template"
                  value={form.template}
                  onChange={(e) => setForm({ ...form, template: e.target.value })}
                  options={[
                    { value: 'royal-kandyan', label: 'Royal Kandyan Gold (Traditional)' },
                    { value: 'classic-ivory', label: 'Classic Ivory & Gold' },
                    { value: 'botanical-blush', label: 'Botanical Blush Floral' },
                    { value: 'modern-minimalist', label: 'Modern Minimalist' },
                    { value: 'poruwa-heritage', label: 'Poruwa Heritage' },
                  ]}
                />

                <Select
                  label="Heading Font Style"
                  value={form.fontFamily}
                  onChange={(e) => setForm({ ...form, fontFamily: e.target.value })}
                  options={[
                    { value: 'Playfair Display', label: 'Playfair Display (Serif Luxury)' },
                    { value: 'Georgia', label: 'Georgia (Classic Elegance)' },
                    { value: 'Inter', label: 'Inter (Clean Modern)' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Bride Name"
                  required
                  value={form.brideName}
                  onChange={(e) => setForm({ ...form, brideName: e.target.value })}
                />
                <Input
                  label="Groom Name"
                  required
                  value={form.groomName}
                  onChange={(e) => setForm({ ...form, groomName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Wedding Date"
                  type="date"
                  required
                  value={form.weddingDate}
                  onChange={(e) => setForm({ ...form, weddingDate: e.target.value })}
                />
                <Input
                  label="Dress Code"
                  placeholder="e.g. Traditional / Formal"
                  value={form.dressCode}
                  onChange={(e) => setForm({ ...form, dressCode: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Reception Venue"
                  placeholder="e.g. Grand Ballroom, Galle Face Hotel"
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                />
                <Input
                  label="City / Location"
                  placeholder="e.g. Colombo, Sri Lanka"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Invitation Message / Words
                </label>
                <textarea
                  rows={3}
                  className="block w-full rounded-xl bg-white border border-stone-200 text-stone-900 text-xs p-3 focus:outline-none focus:border-champagne-500 focus:ring-2 focus:ring-champagne-200/50"
                  value={form.customMessage}
                  onChange={(e) => setForm({ ...form, customMessage: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isRSVPEnabled}
                    onChange={(e) => setForm({ ...form, isRSVPEnabled: e.target.checked })}
                    className="rounded text-champagne-600 focus:ring-champagne-500"
                  />
                  <span>Enable Online RSVP Form</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.allowPlusOne}
                    onChange={(e) => setForm({ ...form, allowPlusOne: e.target.checked })}
                    className="rounded text-champagne-600 focus:ring-champagne-500"
                  />
                  <span>Allow Plus-One / Family Counts</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" variant="primary" size="md" isLoading={saving} icon={Sparkles}>
                  Save Invitation Configuration
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Live Miniature Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
            Live Guest View Preview
          </div>
          <div className="rounded-3xl bg-white border border-champagne-300 shadow-xl p-8 text-center space-y-6">
            <div className="flex items-center justify-center gap-2">
              <div className="h-[1px] w-8 bg-champagne-300" />
              <Heart className="w-4 h-4 text-champagne-600" />
              <div className="h-[1px] w-8 bg-champagne-300" />
            </div>

            <p className="text-[10px] uppercase tracking-widest text-champagne-700 font-bold">
              Together With Their Families
            </p>

            <h2 className="text-3xl font-serif font-bold text-stone-900 leading-tight">
              {form.brideName || 'Bride Name'}
            </h2>
            <div className="font-serif italic text-champagne-600 -my-2">&</div>
            <h2 className="text-3xl font-serif font-bold text-stone-900 leading-tight">
              {form.groomName || 'Groom Name'}
            </h2>

            <p className="text-xs font-serif italic text-stone-600 px-4 leading-relaxed">
              "{form.customMessage}"
            </p>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1 text-xs">
              <div className="font-semibold text-stone-900 flex items-center justify-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-champagne-600" />
                <span>{form.weddingDate ? formatDate(form.weddingDate) : 'Wedding Date'}</span>
              </div>
              <div className="text-[11px] text-stone-500 flex items-center justify-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-champagne-600" />
                <span>{form.venue || 'Venue'}, {form.location || 'Location'}</span>
              </div>
              {form.dressCode && (
                <div className="text-[10px] text-stone-400 pt-1">
                  Dress Code: {form.dressCode}
                </div>
              )}
            </div>

            {form.isRSVPEnabled && (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Online RSVP Form Active for Guests</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

