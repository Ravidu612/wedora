import React, { useState, useEffect } from 'react';
import { useWedding } from '../../contexts/WeddingContext';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import TimelineModal from '../../components/timeline/TimelineModal';
import api from '../../services/api';
import {
  Clock,
  Plus,
  MapPin,
  User,
  Sparkles,
  Edit,
  Trash2,
} from 'lucide-react';

export default function WeddingTimelinePage() {
  const { activeWeddingId } = useWedding();
  const { addToast } = useToast();

  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchTimeline = async () => {
    if (!activeWeddingId) return;
    try {
      setLoading(true);
      const res = await api.get(`/weddings/${activeWeddingId}/timeline`);
      if (res.data.success) {
        setTimeline(res.data.timeline || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, [activeWeddingId]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}" from timeline?`)) return;
    try {
      await api.delete(`/weddings/${activeWeddingId}/timeline/${id}`);
      addToast('Timeline item removed.', 'info');
      fetchTimeline();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete item.', 'error');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-champagne-600">
            Day Schedule
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-textDark tracking-tight mt-1">
            Wedding Day Master Itinerary
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Choreograph Poruwa rituals, auspicious Nekath times, reception events, and dancing in exact order.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingItem(null);
            setModalOpen(true);
          }}
          variant="primary"
          size="sm"
          icon={Plus}
        >
          Add Schedule Event
        </Button>
      </div>

      {/* Timeline Stream */}
      {timeline.length > 0 ? (
        <div className="relative border-l-2 border-champagne-200 ml-4 sm:ml-8 space-y-8 pl-6 sm:pl-8">
          {timeline.map((item, index) => (
            <div key={item._id} className="relative group">
              {/* Timeline Node Dot */}
              <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-full bg-champagne-50 border-2 border-champagne-500 flex items-center justify-center text-[10px] font-bold text-champagne-700 shadow-sm">
                {index + 1}
              </div>

              {/* Event Card */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-soft hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-champagne-100 text-champagne-900 font-bold text-xs">
                      {item.startTime} {item.endTime ? `– ${item.endTime}` : ''}
                    </span>
                    <h3 className="font-serif font-bold text-base text-stone-900">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setModalOpen(true);
                      }}
                      className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.title)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
                  {item.location && (
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <MapPin className="w-3.5 h-3.5 text-champagne-600" />
                      <span>{item.location}</span>
                    </span>
                  )}
                  {item.responsiblePerson && (
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <User className="w-3.5 h-3.5 text-champagne-600" />
                      <span>Coordinator: <strong>{item.responsiblePerson}</strong></span>
                    </span>
                  )}
                </div>

                {item.notes && (
                  <p className="text-xs text-stone-500 mt-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    {item.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Clock}
          title="Timeline is Empty"
          description="Create your auspicious schedule for the wedding day."
          actionText="Add First Event"
          onAction={() => {
            setEditingItem(null);
            setModalOpen(true);
          }}
          actionIcon={Plus}
        />
      )}

      <TimelineModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        item={editingItem}
        onSuccess={fetchTimeline}
      />
    </div>
  );
}

