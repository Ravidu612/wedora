import React, { useState } from 'react';
import { useWedding } from '../../contexts/WeddingContext';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import ContributionModal from '../../components/budget/ContributionModal';
import api from '../../services/api';
import { HandCoins, Plus, Sparkles, Heart, Trash2 } from 'lucide-react';

export default function FamilyContributionsPage() {
  const { activeWeddingId, contributions, financials, currency, refreshActiveWedding } = useWedding();
  const { addToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);

  const activeContributions = contributions.filter((c) => !c.isDeleted);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove contribution from ${name}?`)) return;
    try {
      await api.delete(`/weddings/${activeWeddingId}/contributions/${id}`);
      addToast('Contribution removed.', 'info');
      refreshActiveWedding();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to remove contribution.', 'error');
    }
  };

  const sides = financials?.contributionsBySide || {};

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-champagne-600">
            Support & Sponsorship
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-textDark tracking-tight mt-1">
            Family Contributions & Gifts
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Track generous financial gifts and personal savings that fund your wedding in {currency}.
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          variant="primary"
          size="sm"
          icon={Plus}
        >
          Add Contribution
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Funding Received"
          value={formatCurrency(financials?.totalContributions || 0, currency)}
          badgeText="Total"
          badgeType="success"
          subtext="Sum of all contributions"
          icon={HandCoins}
        />
        <StatCard
          title="Bride Family Side"
          value={formatCurrency(sides['Bride Family'] || 0, currency)}
          subtext="Parents & Relatives"
          icon={Heart}
        />
        <StatCard
          title="Groom Family Side"
          value={formatCurrency(sides['Groom Family'] || 0, currency)}
          subtext="Parents & Relatives"
          icon={Heart}
        />
        <StatCard
          title="Couple Personal Savings"
          value={formatCurrency((sides.Bride || 0) + (sides.Groom || 0) + (sides.Shared || 0), currency)}
          subtext="Self-funded portions"
          icon={Sparkles}
        />
      </div>

      {/* Table */}
      {activeContributions.length > 0 ? (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-ivory/80 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                  <th className="py-3 px-4">Contributor</th>
                  <th className="py-3 px-4">Family Side</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {activeContributions.map((item) => (
                  <tr key={item._id} className="hover:bg-stone-50/50">
                    <td className="py-3 px-4 font-bold text-stone-900">{item.contributorName}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                        {item.familySide}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-600">{item.contributionType}</td>
                    <td className="py-3 px-4 text-stone-500">{formatDate(item.contributionDate)}</td>
                    <td className="py-3 px-4 text-stone-500 max-w-xs truncate">{item.notes || '-'}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700 text-right">
                      {formatCurrency(item.amount, currency)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(item._id, item.contributorName)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete contribution"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <EmptyState
          icon={HandCoins}
          title="No Contributions Logged"
          description="Log funding received from parents, personal couple savings, or relatives."
          actionText="Record First Contribution"
          onAction={() => setModalOpen(true)}
          actionIcon={Plus}
        />
      )}

      <ContributionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={refreshActiveWedding}
      />
    </div>
  );
}

