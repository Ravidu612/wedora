import React, { useState, useEffect } from 'react';
import { useWedding } from '../../contexts/WeddingContext';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import {
  UserCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  Utensils,
  Share2,
} from 'lucide-react';

export default function RSVPManagementPage() {
  const { activeWeddingId } = useWedding();
  const { addToast } = useToast();

  const [guests, setGuests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchRSVPs = async () => {
    if (!activeWeddingId) return;
    try {
      setLoading(true);
      const [gRes, sRes] = await Promise.all([
        api.get(`/weddings/${activeWeddingId}/guests`),
        api.get(`/weddings/${activeWeddingId}/guests/stats`),
      ]);
      if (gRes.data.success) {
        setGuests(gRes.data.guests || []);
      }
      if (sRes.data.success) {
        setStats(sRes.data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRSVPs();
  }, [activeWeddingId]);

  const handleUpdateStatus = async (guestId, newStatus) => {
    try {
      await api.put(`/weddings/${activeWeddingId}/guests/${guestId}`, {
        rsvpStatus: newStatus,
      });
      addToast(`Status updated to ${newStatus}.`, 'success');
      fetchRSVPs();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update status.', 'error');
    }
  };

  const filteredGuests = guests.filter((g) => {
    if (filter === 'All') return true;
    return g.rsvpStatus === filter;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-champagne-600">
            Attendance Tracking
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-textDark tracking-tight mt-1">
            RSVP & Catering Headcounts
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Monitor confirmed attendee headcounts, plus-ones, and meal preferences.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Expected Attendees"
          value={stats?.expectedAttendees || 0}
          badgeText="Seats"
          badgeType="gold"
          subtext="Confirmed headcounts"
          icon={Users}
        />
        <StatCard
          title="Accepted RSVPs"
          value={stats?.confirmedGuests || 0}
          badgeText="Confirmed"
          badgeType="success"
          subtext="Yes responses"
          icon={CheckCircle2}
        />
        <StatCard
          title="Pending Responses"
          value={stats?.pendingRSVP || 0}
          badgeText="Awaiting"
          badgeType="warning"
          subtext="Follow-up needed"
          icon={Clock}
        />
        <StatCard
          title="Declined"
          value={stats?.declinedGuests || 0}
          badgeText="Declined"
          badgeType="neutral"
          subtext="Unable to attend"
          icon={XCircle}
        />
      </div>

      {/* Dietary Summary Banner */}
      {stats?.dietaryBreakdown && Object.keys(stats.dietaryBreakdown).length > 0 && (
        <Card title="Catering Dietary Breakdown">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {Object.entries(stats.dietaryBreakdown).map(([diet, count]) => (
              <div key={diet} className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <div className="font-semibold text-textMuted text-[11px] truncate">{diet}</div>
                <div className="text-lg font-serif font-bold text-textDark mt-0.5">{count} pax</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        {['All', 'Accepted', 'Pending', 'Declined'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              filter === tab
                ? 'bg-champagne-500 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {tab} {tab === 'All' ? `(${guests.length})` : ''}
          </button>
        ))}
      </div>

      {/* RSVP Table */}
      {filteredGuests.length > 0 ? (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-ivory/80 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                  <th className="py-3 px-4">Guest Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Attendees</th>
                  <th className="py-3 px-4">Dietary Preference</th>
                  <th className="py-3 px-4">Wishes / Notes</th>
                  <th className="py-3 px-4 text-right">Quick Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredGuests.map((g) => (
                  <tr key={g._id} className="hover:bg-stone-50/50">
                    <td className="py-3 px-4 font-bold text-stone-900">{g.name}</td>
                    <td className="py-3 px-4 text-stone-600">{g.phone || g.email || '-'}</td>
                    <td className="py-3 px-4">
                      <Badge variant={g.rsvpStatus} size="sm">{g.rsvpStatus}</Badge>
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-800">{g.attendeesCount || 1} pax</td>
                    <td className="py-3 px-4 text-stone-600">{g.dietaryPreferences}</td>
                    <td className="py-3 px-4 text-stone-500 max-w-xs truncate">{g.specialNotes || '-'}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {g.rsvpStatus !== 'Accepted' && (
                          <button
                            onClick={() => handleUpdateStatus(g._id, 'Accepted')}
                            className="px-2 py-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded"
                          >
                            Accept
                          </button>
                        )}
                        {g.rsvpStatus !== 'Declined' && (
                          <button
                            onClick={() => handleUpdateStatus(g._id, 'Declined')}
                            className="px-2 py-0.5 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded"
                          >
                            Decline
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <EmptyState
          icon={UserCheck}
          title="No RSVPs in this category"
          description="Send out your digital invitation links to start collecting RSVPs."
        />
      )}
    </div>
  );
}

