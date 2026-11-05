import React, { useState, useEffect } from 'react';
import { useWedding } from '../../contexts/WeddingContext';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import GuestModal from '../../components/guests/GuestModal';
import CSVImportModal from '../../components/guests/CSVImportModal';
import api from '../../services/api';
import {
  Users,
  Plus,
  Upload,
  Download,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  Mail,
  Edit,
  Trash2,
} from 'lucide-react';

export default function GuestManagementPage() {
  const { activeWeddingId } = useWedding();
  const { addToast } = useToast();

  const [guests, setGuests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [rsvpFilter, setRsvpFilter] = useState('All');

  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [csvModalOpen, setCsvModalOpen] = useState(false);

  const fetchGuests = async () => {
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
    fetchGuests();
  }, [activeWeddingId]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name} from guest list?`)) return;
    try {
      await api.delete(`/weddings/${activeWeddingId}/guests/${id}`);
      addToast('Guest removed.', 'info');
      fetchGuests();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to remove guest.', 'error');
    }
  };

  const handleExportCSV = () => {
    window.open(`/api/weddings/${activeWeddingId}/reports/guests-csv`, '_blank');
  };

  const filteredGuests = guests.filter((g) => {
    const matchSearch =
      (g.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (g.phone || '').includes(search) ||
      (g.email || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || g.category === categoryFilter;
    const matchRsvp = rsvpFilter === 'All' || g.rsvpStatus === rsvpFilter;
    return matchSearch && matchCat && matchRsvp;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-champagne-600">
            Guest Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-textDark tracking-tight mt-1">
            Guest List & Headcounts
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Manage invitations, attendees, plus-ones, and dietary restrictions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setCsvModalOpen(true)}
            variant="outline"
            size="sm"
            icon={Upload}
          >
            Import CSV
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="secondary"
            size="sm"
            icon={Download}
          >
            Export CSV
          </Button>
          <Button
            onClick={() => {
              setEditingGuest(null);
              setGuestModalOpen(true);
            }}
            variant="primary"
            size="sm"
            icon={Plus}
          >
            Add Guest
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Total Guests"
          value={stats?.totalGuests || 0}
          subtext="Parties listed"
          icon={Users}
        />
        <StatCard
          title="Expected Attendees"
          value={stats?.expectedAttendees || 0}
          badgeText="Seats"
          badgeType="gold"
          subtext="Confirmed headcounts"
          icon={CheckCircle2}
        />
        <StatCard
          title="Confirmed RSVPs"
          value={stats?.confirmedGuests || 0}
          badgeText="Accepted"
          badgeType="success"
          subtext="Yes responses"
          icon={CheckCircle2}
        />
        <StatCard
          title="Pending RSVPs"
          value={stats?.pendingRSVP || 0}
          badgeText="Awaiting"
          badgeType="warning"
          subtext="Not yet responded"
          icon={Clock}
        />
        <StatCard
          title="Declined"
          value={stats?.declinedGuests || 0}
          badgeText="Declined"
          badgeType="neutral"
          subtext="Cannot attend"
          icon={XCircle}
        />
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            placeholder="Search by name, phone, or email..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Guest Categories' },
              { value: 'Bride Family', label: 'Bride Family' },
              { value: 'Groom Family', label: 'Groom Family' },
              { value: 'Bride Friends', label: 'Bride Friends' },
              { value: 'Groom Friends', label: 'Groom Friends' },
              { value: 'Relatives', label: 'Relatives' },
              { value: 'Colleagues', label: 'Colleagues' },
              { value: 'VIP', label: 'VIP Guests' },
              { value: 'Other', label: 'Other' },
            ]}
          />

          <Select
            value={rsvpFilter}
            onChange={(e) => setRsvpFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All RSVP Statuses' },
              { value: 'Accepted', label: 'Accepted (Attending)' },
              { value: 'Pending', label: 'Pending Response' },
              { value: 'Declined', label: 'Declined' },
            ]}
          />
        </div>
      </Card>

      {/* Guest Table */}
      {filteredGuests.length > 0 ? (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-ivory/80 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                  <th className="py-3 px-4">Guest Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">RSVP Status</th>
                  <th className="py-3 px-4">Attendees</th>
                  <th className="py-3 px-4">Dietary Preference</th>
                  <th className="py-3 px-4">Table</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredGuests.map((g) => (
                  <tr key={g._id} className="hover:bg-stone-50/50">
                    <td className="py-3 px-4 font-bold text-stone-900">
                      {g.name}
                      {g.specialNotes && (
                        <div className="text-[10px] text-stone-400 font-normal">{g.specialNotes}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      <div>{g.phone || '-'}</div>
                      <div className="text-[10px] text-stone-400">{g.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                        {g.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={g.rsvpStatus} size="sm">{g.rsvpStatus}</Badge>
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-800">
                      {g.attendeesCount || 1} pax
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      {g.dietaryPreferences}
                    </td>
                    <td className="py-3 px-4">
                      {g.table ? (
                        <span className="font-semibold text-champagne-800 bg-champagne-50 border border-champagne-200 px-2 py-0.5 rounded text-[11px]">
                          Table {g.table.tableNumber}
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[11px]">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingGuest(g);
                            setGuestModalOpen(true);
                          }}
                          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(g._id, g.name)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
          icon={Users}
          title="No Guests Found"
          description="Build your wedding guest list or import it from a CSV spreadsheet."
          actionText="Add First Guest"
          onAction={() => {
            setEditingGuest(null);
            setGuestModalOpen(true);
          }}
          actionIcon={Plus}
        />
      )}

      {/* Modals */}
      <GuestModal
        isOpen={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
        guest={editingGuest}
        onSuccess={fetchGuests}
      />

      <CSVImportModal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        onSuccess={fetchGuests}
      />
    </div>
  );
}

