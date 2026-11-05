import React, { useState, useEffect } from 'react';
import { useWedding } from '../../contexts/WeddingContext';
import { useToast } from '../../contexts/ToastContext';
import { formatDate } from '../../utils/date';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import TaskModal from '../../components/tasks/TaskModal';
import api from '../../services/api';
import {
  CheckSquare,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Trash2,
  Edit,
} from 'lucide-react';

export default function WeddingChecklistPage() {
  const { activeWeddingId } = useWedding();
  const { addToast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBucket, setSelectedBucket] = useState('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    if (!activeWeddingId) return;
    try {
      setLoading(true);
      const res = await api.get(`/weddings/${activeWeddingId}/tasks`);
      if (res.data.success) {
        setTasks(res.data.tasks || []);
        setProgress(res.data.progress);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [activeWeddingId]);

  const handleToggleTaskStatus = async (task) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await api.put(`/weddings/${activeWeddingId}/tasks/${task._id}`, {
        status: nextStatus,
      });
      fetchTasks();
    } catch (err) {
      addToast('Failed to update task status.', 'error');
    }
  };

  const handleDeleteTask = async (id, title) => {
    if (!window.confirm(`Delete task "${title}"?`)) return;
    try {
      await api.delete(`/weddings/${activeWeddingId}/tasks/${id}`);
      addToast('Task removed.', 'info');
      fetchTasks();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to remove task.', 'error');
    }
  };

  const buckets = [
    'All',
    '12 Months Before',
    '9 Months Before',
    '6 Months Before',
    '3 Months Before',
    '1 Month Before',
    '1 Week Before',
    'Wedding Day',
  ];

  const filteredTasks = tasks.filter((t) => {
    if (selectedBucket === 'All') return true;
    return t.timelineBucket === selectedBucket;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-champagne-600">
            Roadmap & Milestones
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-textDark tracking-tight mt-1">
            Wedding Planning Checklist
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Built-in Sri Lankan wedding traditions and timeline tasks from 12 months out to your big day.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingTask(null);
            setModalOpen(true);
          }}
          variant="primary"
          size="sm"
          icon={Plus}
        >
          Add Task
        </Button>
      </div>

      {/* Progress Bar Card */}
      {progress && (
        <Card className="bg-gradient-to-r from-white to-ivory border-champagne-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
            <div>
              <span className="text-xs font-semibold text-textMuted uppercase">Checklist Progress</span>
              <div className="text-xl font-serif font-bold text-textDark">
                {progress.completedTasks} of {progress.totalTasks} Tasks Completed
              </div>
            </div>
            <span className="text-sm font-bold text-champagne-800 bg-champagne-100 px-3 py-1 rounded-full border border-champagne-300">
              {progress.progressPercent}% Completed
            </span>
          </div>

          <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress.progressPercent}%` }}
            />
          </div>
        </Card>
      )}

      {/* Bucket Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {buckets.map((b) => (
          <button
            key={b}
            onClick={() => setSelectedBucket(b)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedBucket === b
                ? 'bg-champagne-500 text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-3">
          {filteredTasks.map((t) => {
            const isCompleted = t.status === 'Completed';

            return (
              <div
                key={t._id}
                className={`flex items-start justify-between p-4 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-stone-50/70 border-stone-200 text-stone-400'
                    : 'bg-white border-stone-200/80 shadow-soft hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => handleToggleTaskStatus(t)}
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-stone-300 hover:border-champagne-500 bg-white'
                    }`}
                  >
                    {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div>
                    <h4
                      className={`text-xs sm:text-sm font-bold ${
                        isCompleted ? 'line-through text-stone-400' : 'text-stone-900'
                      }`}
                    >
                      {t.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-stone-500">
                      <span className="font-semibold text-champagne-800 bg-champagne-50 px-2 py-0.5 rounded">
                        {t.timelineBucket}
                      </span>
                      <span>•</span>
                      <span>Assigned to: <strong>{t.assignedTo}</strong></span>
                      {t.dueDate && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(t.dueDate)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={t.priority === 'Urgent' ? 'overdue' : t.priority === 'High' ? 'partially-paid' : 'default'}
                    size="sm"
                  >
                    {t.priority}
                  </Badge>

                  <button
                    onClick={() => {
                      setEditingTask(t);
                      setModalOpen(true);
                    }}
                    className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(t._id, t.title)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={CheckSquare}
          title="No Tasks in this Milestone"
          description="Add customized tasks for your wedding coordination."
          actionText="Add New Task"
          onAction={() => {
            setEditingTask(null);
            setModalOpen(true);
          }}
          actionIcon={Plus}
        />
      )}

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        task={editingTask}
        onSuccess={fetchTasks}
      />
    </div>
  );
}

