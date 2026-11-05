import React, { useState } from 'react';
import { useWedding } from '../../contexts/WeddingContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency } from '../../utils/currency';
import { formatDate, getCountdownDetails } from '../../utils/date';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import api from '../../services/api';
import {
  Heart,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  UserPlus,
  Mail,
  Shield,
  Sparkles,
  PartyPopper,
} from 'lucide-react';

export default function WeddingOverview() {
  const { activeWedding, weddingEvents, weddingMembers, currency, refreshActiveWedding } = useWedding();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerRole, setPartnerRole] = useState('partner');
  const [inviteLoading, setInviteLoading] = useState(false);

  if (!activeWedding) return null;

  const countdown = getCountdownDetails(activeWedding.weddingDate);

  const handleInvitePartner = async (e) => {
    e.preventDefault();
    if (!partnerEmail) {
      addToast('Please enter an email address.', 'warning');
      return;
    }

    try {
      setInviteLoading(true);
      await api.post(`/weddings/${activeWedding._id}/invite`, {
        email: partnerEmail,
        role: partnerRole,
      });

      addToast(`Invitation registered for ${partnerEmail}!`, 'success');
      setPartnerEmail('');
      setInviteModalOpen(false);
      refreshActiveWedding();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to send invite.', 'error');
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-champagne-600">
            Workspace Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-textDark tracking-tight mt-1">
            {activeWedding.brideName} & {activeWedding.groomName}
          </h1>
          <p className="text-xs text-textMuted mt-1 flex items-center gap-2">
            <span>{activeWedding.weddingType}</span>
            <span>•</span>
            <span>{activeWedding.weddingTheme}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setInviteModalOpen(true)}
            variant="gold-outline"
            size="sm"
            icon={UserPlus}
          >
            Invite Partner / Family
          </Button>
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details Card */}
        <Card title="Wedding Essentials" className="space-y-4">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Bride Full Name</span>
              <span className="font-semibold text-stone-900">{activeWedding.brideName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Groom Full Name</span>
              <span className="font-semibold text-stone-900">{activeWedding.groomName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Wedding Date</span>
              <span className="font-semibold text-champagne-700">{formatDate(activeWedding.weddingDate)}</span>
            </div>
            {activeWedding.homecomingDate && (
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Homecoming Date</span>
                <span className="font-semibold text-stone-900">{formatDate(activeWedding.homecomingDate)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Main Location</span>
              <span className="font-semibold text-stone-900">{activeWedding.location}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-stone-500">Venue</span>
              <span className="font-semibold text-stone-900">{activeWedding.venue || 'To be finalized'}</span>
            </div>
          </div>
        </Card>

        {/* Financial & Guest Targets */}
        <Card title="Budget & Guest Targets" className="space-y-4">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Total Wedding Budget</span>
              <span className="font-bold text-stone-900 font-serif text-sm">
                {formatCurrency(activeWedding.totalBudget, currency)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Bride Side Budget</span>
              <span className="font-semibold text-stone-800">
                {formatCurrency(activeWedding.brideSideBudget, currency)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Groom Side Budget</span>
              <span className="font-semibold text-stone-800">
                {formatCurrency(activeWedding.groomSideBudget, currency)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Shared Reception Budget</span>
              <span className="font-semibold text-stone-800">
                {formatCurrency(activeWedding.sharedBudget, currency)}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-stone-500">Estimated Guests</span>
              <span className="font-bold text-stone-900">{activeWedding.estimatedGuestCount} Guests</span>
            </div>
          </div>
        </Card>

        {/* Collaborators & Partner Access */}
        <Card
          title="Workspace Collaborators"
          action={
            <button
              onClick={() => setInviteModalOpen(true)}
              className="text-xs font-semibold text-champagne-700 hover:underline"
            >
              + Invite
            </button>
          }
        >
          <div className="divide-y divide-stone-100 text-xs">
            {weddingMembers.map((m) => (
              <div key={m._id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-champagne-100 text-champagne-800 flex items-center justify-center font-bold text-xs">
                    {m.user?.name ? m.user.name.charAt(0).toUpperCase() : 'M'}
                  </div>
                  <div>
                    <div className="font-bold text-stone-900">{m.user?.name || m.inviteEmail}</div>
                    <div className="text-[10px] text-stone-400 capitalize">{m.role.replace('_', ' ')}</div>
                  </div>
                </div>
                <Badge variant={m.status === 'accepted' ? 'confirmed' : 'pending'} size="sm">
                  {m.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Scheduled Wedding Events */}
      <Card title="Ceremony Events Sequence">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weddingEvents.map((event) => (
            <div key={event._id} className="p-4 rounded-xl bg-ivory/60 border border-stone-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">{event.title}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-champagne-100 text-champagne-800">
                  {event.eventType}
                </span>
              </div>
              <div className="text-xs text-textMuted space-y-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-champagne-600" />
                  <span>{formatDate(event.date)} • {event.startTime} - {event.endTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-champagne-600" />
                  <span>{event.venue || 'Ballroom'}, {event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Invite Modal */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite Partner or Family Member"
        subtitle="Collaborate on wedding planning and budget management together"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleInvitePartner} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="fiance_or_family@example.com"
            required
            value={partnerEmail}
            onChange={(e) => setPartnerEmail(e.target.value)}
          />

          <div className="w-full">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Role
            </label>
            <select
              value={partnerRole}
              onChange={(e) => setPartnerRole(e.target.value)}
              className="block w-full rounded-xl bg-white border border-stone-200 text-stone-900 text-sm py-2.5 px-3.5"
            >
              <option value="partner">Partner (Full Edit Access)</option>
              <option value="family_collaborator">Family Member (Contributor)</option>
              <option value="viewer">Viewer (Read-Only)</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
            <Button variant="outline" size="sm" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={inviteLoading}>
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

