import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import confetti from 'canvas-confetti';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Heart,
  Share2,
  PartyPopper,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { formatDate } from '../../utils/date';

export default function PublicInvitationPage() {
  const { slug } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // RSVP Form state
  const [rsvpData, setRsvpData] = useState({
    name: '',
    phone: '',
    email: '',
    rsvpStatus: 'Accepted',
    attendeesCount: 1,
    hasPlusOne: false,
    plusOneName: '',
    dietaryPreferences: 'Standard / Non-Veg',
    specialNotes: '',
  });
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpMessage, setRsvpMessage] = useState('');

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/invitations/public/${slug}`);
        if (res.data.success) {
          setInvitation(res.data.invitation);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load invitation.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [slug]);

  const handleRSVPSubmit = async (e) => {
    e.preventDefault();
    if (!rsvpData.name) return;

    try {
      setRsvpSubmitting(true);
      const res = await api.post(`/invitations/public/${slug}/rsvp`, rsvpData);
      if (res.data.success) {
        setRsvpSubmitted(true);
        setRsvpMessage(res.data.message);

        // Confetti celebration
        if (rsvpData.rsvpStatus === 'Accepted') {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#C9A46A', '#E8D5D0', '#FAF7F2', '#16A34A'],
          });
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit RSVP.');
    } finally {
      setRsvpSubmitting(false);
    }
  };

  const handleWhatsAppShare = () => {
    const url = window.location.href;
    const text = encodeURIComponent(
      `You're invited to celebrate the wedding of ${invitation.brideName} & ${invitation.groomName}! View details and RSVP here: ${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-champagne-300 border-t-champagne-600 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-serif text-stone-600">Opening wedding invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 text-center space-y-4 shadow-lg">
          <Heart className="w-10 h-10 text-stone-300 mx-auto" />
          <h2 className="text-xl font-serif font-bold text-textDark">Invitation Unavailable</h2>
          <p className="text-xs text-textMuted">{error || 'This invitation could not be found.'}</p>
          <Link to="/">
            <Button variant="primary" size="md">Return to Wedora Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Template background & theme classes
  const isKandyan = invitation.template === 'royal-kandyan' || invitation.template === 'poruwa-heritage';
  const isBlush = invitation.template === 'botanical-blush';

  return (
    <div className={`min-h-screen ${isBlush ? 'bg-[#FDF9F8]' : 'bg-[#FAF7F2]'} py-12 px-4 sm:px-6`}>
      <div className="max-w-2xl mx-auto space-y-10">
        {/* Main Invitation Card */}
        <div className="relative bg-white rounded-3xl border border-champagne-300/80 shadow-2xl p-8 sm:p-14 text-center overflow-hidden">
          {/* Top traditional filigree design */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-champagne-300" />
            <Sparkles className="w-5 h-5 text-champagne-500" />
            <div className="h-[1px] w-12 bg-champagne-300" />
          </div>

          {/* Subtitle / Traditional Quote */}
          <p className="text-xs uppercase tracking-widest text-champagne-700 font-semibold mb-4">
            Together With Their Families
          </p>

          {/* Couple Names */}
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-stone-900 tracking-tight mb-2">
            {invitation.brideName}
          </h1>
          <div className="text-2xl font-serif italic text-champagne-600 my-1">&</div>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-stone-900 tracking-tight mb-6">
            {invitation.groomName}
          </h1>

          {/* Custom Message */}
          <p className="text-sm font-serif italic text-stone-600 max-w-md mx-auto leading-relaxed mb-8">
            "{invitation.customMessage}"
          </p>

          {/* Date, Location, Venue Badges */}
          <div className="space-y-3 py-6 border-y border-champagne-200/80 bg-stone-50/50 rounded-2xl mb-8">
            <div className="flex items-center justify-center gap-2 text-stone-800 font-serif font-semibold text-base sm:text-lg">
              <Calendar className="w-5 h-5 text-champagne-600" />
              <span>{formatDate(invitation.weddingDate)}</span>
            </div>
            {invitation.venue && (
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-stone-600 font-medium">
                <MapPin className="w-4 h-4 text-champagne-600" />
                <span>{invitation.venue}, {invitation.location}</span>
              </div>
            )}
            {invitation.dressCode && (
              <div className="text-xs text-stone-500">
                Dress Code: <span className="font-semibold text-stone-700">{invitation.dressCode}</span>
              </div>
            )}
          </div>

          {/* Wedding Day Schedule */}
          {invitation.schedule && invitation.schedule.length > 0 && (
            <div className="space-y-4 mb-8 text-left">
              <h3 className="text-center font-serif font-bold text-base text-textDark mb-4">
                Celebration Itinerary
              </h3>
              <div className="space-y-2.5">
                {invitation.schedule.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3 rounded-xl bg-ivory/60 border border-stone-200/60">
                    <div className="text-xs font-bold text-champagne-700 bg-white px-2.5 py-1 rounded-lg border border-champagne-200 shrink-0">
                      {item.time}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">{item.title}</div>
                      {item.description && (
                        <div className="text-[11px] text-stone-500">{item.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Share Via WhatsApp */}
          <div className="pt-2">
            <Button
              onClick={handleWhatsAppShare}
              variant="gold-outline"
              size="sm"
              icon={Share2}
              className="rounded-full"
            >
              Share Invitation on WhatsApp
            </Button>
          </div>
        </div>

        {/* Interactive RSVP Card */}
        {invitation.isRSVPEnabled && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-10 text-center">
            {rsvpSubmitted ? (
              <div className="space-y-4 py-6">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-textDark">
                  RSVP Received!
                </h3>
                <p className="text-xs sm:text-sm text-textMuted max-w-sm mx-auto leading-relaxed">
                  {rsvpMessage}
                </p>
                <button
                  onClick={() => setRsvpSubmitted(false)}
                  className="text-xs text-champagne-700 underline font-medium hover:text-champagne-900 pt-2 block mx-auto"
                >
                  Edit your response
                </button>
              </div>
            ) : (
              <form onSubmit={handleRSVPSubmit} className="space-y-5 text-left">
                <div className="text-center space-y-1 mb-6">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-champagne-700">
                    Kindly Respond
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-textDark">
                    Will You Celebrate With Us?
                  </h3>
                </div>

                {/* RSVP Attendance Toggle */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRsvpData({ ...rsvpData, rsvpStatus: 'Accepted' })}
                    className={`py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      rsvpData.rsvpStatus === 'Accepted'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Joyfully Accept</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRsvpData({ ...rsvpData, rsvpStatus: 'Declined' })}
                    className={`py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      rsvpData.rsvpStatus === 'Declined'
                        ? 'bg-rose-50 border-rose-400 text-rose-800 shadow-sm'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>Regretfully Decline</span>
                  </button>
                </div>

                <Input
                  label="Your Full Name"
                  placeholder="e.g. Mr. & Mrs. Perera"
                  required
                  value={rsvpData.name}
                  onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Phone / WhatsApp"
                    type="tel"
                    placeholder="+94 77 123 4567"
                    value={rsvpData.phone}
                    onChange={(e) => setRsvpData({ ...rsvpData, phone: e.target.value })}
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="guest@example.com"
                    value={rsvpData.email}
                    onChange={(e) => setRsvpData({ ...rsvpData, email: e.target.value })}
                  />
                </div>

                {rsvpData.rsvpStatus === 'Accepted' && (
                  <div className="space-y-4 pt-2 border-t border-stone-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Select
                        label="Total Attendees in Party"
                        value={rsvpData.attendeesCount}
                        onChange={(e) => setRsvpData({ ...rsvpData, attendeesCount: Number(e.target.value) })}
                        options={[
                          { value: 1, label: '1 Guest (Just Me)' },
                          { value: 2, label: '2 Guests' },
                          { value: 3, label: '3 Guests' },
                          { value: 4, label: '4 Guests (Family)' },
                          { value: 5, label: '5 Guests (Family)' },
                        ]}
                      />

                      <Select
                        label="Dietary Preference"
                        value={rsvpData.dietaryPreferences}
                        onChange={(e) => setRsvpData({ ...rsvpData, dietaryPreferences: e.target.value })}
                        options={[
                          { value: 'Standard / Non-Veg', label: 'Standard / Non-Veg' },
                          { value: 'Vegetarian', label: 'Vegetarian' },
                          { value: 'Vegan', label: 'Vegan' },
                          { value: 'Halal', label: 'Halal' },
                          { value: 'No Seafood', label: 'No Seafood' },
                        ]}
                      />
                    </div>
                  </div>
                )}

                <div className="w-full">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Warm Wishes / Special Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Leave a heartfelt message for the bride and groom..."
                    value={rsvpData.specialNotes}
                    onChange={(e) => setRsvpData({ ...rsvpData, specialNotes: e.target.value })}
                    className="block w-full rounded-xl bg-white border border-stone-200 text-stone-900 text-xs p-3 transition-all focus:outline-none focus:border-champagne-500 focus:ring-2 focus:ring-champagne-200/50"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={rsvpSubmitting}
                  icon={PartyPopper}
                >
                  Confirm RSVP
                </Button>
              </form>
            )}
          </div>
        )}

        {/* Footer brand */}
        <div className="text-center text-xs text-stone-400">
          Powered by <Link to="/" className="font-semibold text-champagne-600 hover:underline">Wedora</Link> — Smart Wedding System
        </div>
      </div>
    </div>
  );
}

