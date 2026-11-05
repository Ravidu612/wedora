import React, { useState, useEffect } from 'react';
import { useWedding } from '../../contexts/WeddingContext';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import TableModal from '../../components/seating/TableModal';
import api from '../../services/api';
import {
  Armchair,
  Plus,
  Users,
  CheckCircle2,
  Trash2,
  Edit,
  UserPlus,
  X,
} from 'lucide-react';

export default function SeatingPlannerPage() {
  const { activeWeddingId } = useWedding();
  const { addToast } = useToast();

  const [tables, setTables] = useState([]);
  const [seatedCount, setSeatedCount] = useState(0);
  const [unassignedCount, setUnassignedCount] = useState(0);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [targetTableForAssign, setTargetTableForAssign] = useState(null);
  const [selectedGuestToAssign, setSelectedGuestToAssign] = useState('');

  const fetchSeatingData = async () => {
    if (!activeWeddingId) return;
    try {
      setLoading(true);
      const [tRes, gRes] = await Promise.all([
        api.get(`/weddings/${activeWeddingId}/tables`),
        api.get(`/weddings/${activeWeddingId}/guests`),
      ]);

      if (tRes.data.success) {
        setTables(tRes.data.tables || []);
        setSeatedCount(tRes.data.seatedGuests || 0);
        setUnassignedCount(tRes.data.unassignedGuests || 0);
      }
      if (gRes.data.success) {
        setGuests(gRes.data.guests || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeatingData();
  }, [activeWeddingId]);

  const handleDeleteTable = async (id, num) => {
    if (!window.confirm(`Delete Table ${num}? Assigned guests will become unseated.`)) return;
    try {
      await api.delete(`/weddings/${activeWeddingId}/tables/${id}`);
      addToast('Table removed.', 'info');
      fetchSeatingData();
    } catch (err) {
      addToast('Failed to delete table.', 'error');
    }
  };

  const handleAssignGuest = async (e) => {
    e.preventDefault();
    if (!selectedGuestToAssign || !targetTableForAssign) return;

    try {
      await api.post(`/weddings/${activeWeddingId}/tables/${targetTableForAssign._id}/assign`, {
        guestId: selectedGuestToAssign,
      });
      addToast('Guest seated successfully!', 'success');
      setSelectedGuestToAssign('');
      setAssignModalOpen(false);
      fetchSeatingData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to assign seat.', 'error');
    }
  };

  // Filter unassigned guests for assignment dropdown
  const unassignedGuests = guests.filter((g) => !g.table);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-champagne-600">
            Ballroom Floor Plan
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-textDark tracking-tight mt-1">
            Guest Seating & Tables
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Organize bride-side, groom-side, VIP, and family tables with seat capacities.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingTable(null);
            setTableModalOpen(true);
          }}
          variant="primary"
          size="sm"
          icon={Plus}
        >
          Create Table
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Tables"
          value={tables.length}
          subtext="Ballroom layout"
          icon={Armchair}
        />
        <StatCard
          title="Seated Guests"
          value={seatedCount}
          badgeText="Assigned"
          badgeType="success"
          subtext="Assigned to a table"
          icon={CheckCircle2}
        />
        <StatCard
          title="Unassigned Guests"
          value={unassignedCount}
          badgeText="Unseated"
          badgeType={unassignedCount > 0 ? 'warning' : 'neutral'}
          subtext="Guests needing a seat"
          icon={Users}
        />
      </div>

      {/* Tables Visual Grid */}
      {tables.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map((t) => {
            const currentOccupancy = t.assignedGuests?.length || 0;
            const isFull = currentOccupancy >= t.capacity;

            return (
              <Card
                key={t._id}
                className="flex flex-col justify-between hover:shadow-md transition-shadow border-stone-200"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
                    <div>
                      <span className="text-[11px] font-bold text-champagne-700 uppercase tracking-wider">
                        {t.category}
                      </span>
                      <h3 className="font-serif font-bold text-base text-stone-900">
                        {t.tableName || `Table ${t.tableNumber}`}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingTable(t);
                          setTableModalOpen(true);
                        }}
                        className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTable(t._id, t.tableNumber)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Occupancy Indicator */}
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-stone-500">Seats:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                        isFull
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {currentOccupancy} / {t.capacity} Filled
                    </span>
                  </div>

                  {/* Assigned Guest Pills */}
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {t.assignedGuests && t.assignedGuests.length > 0 ? (
                      t.assignedGuests.map((g) => (
                        <div
                          key={g._id}
                          className="flex items-center justify-between p-2 rounded-xl bg-ivory/80 text-xs border border-stone-200/60"
                        >
                          <span className="font-semibold text-stone-800 truncate">{g.name}</span>
                          <span className="text-[10px] text-stone-500">{g.category}</span>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-xs text-stone-400">
                        No guests seated at this table yet.
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-stone-100">
                  <Button
                    onClick={() => {
                      setTargetTableForAssign(t);
                      setAssignModalOpen(true);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    disabled={isFull}
                    icon={UserPlus}
                  >
                    {isFull ? 'Table at Full Capacity' : 'Assign Guest to Table'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Armchair}
          title="No Tables Configured"
          description="Create round or rectangular tables to start assigning your guests."
          actionText="Create First Table"
          onAction={() => {
            setEditingTable(null);
            setTableModalOpen(true);
          }}
          actionIcon={Plus}
        />
      )}

      {/* Modals */}
      <TableModal
        isOpen={tableModalOpen}
        onClose={() => setTableModalOpen(false)}
        table={editingTable}
        onSuccess={fetchSeatingData}
      />

      {/* Assign Guest Modal */}
      {assignModalOpen && targetTableForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-base text-textDark">
                Seat Guest at Table {targetTableForAssign.tableNumber}
              </h3>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignGuest} className="space-y-4">
              <div className="w-full">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Select Guest to Seat
                </label>
                <select
                  value={selectedGuestToAssign}
                  onChange={(e) => setSelectedGuestToAssign(e.target.value)}
                  className="block w-full rounded-xl bg-white border border-stone-200 text-stone-900 text-xs py-2.5 px-3"
                  required
                >
                  <option value="">-- Choose unassigned guest --</option>
                  {unassignedGuests.map((g) => (
                    <option key={g._id} value={g._id}>
                      {g.name} ({g.category} • {g.attendeesCount} pax)
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setAssignModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Confirm Seating
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

