import React, { useState } from 'react';
import { useWedding } from '../../contexts/WeddingContext';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency } from '../../utils/currency';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import CateringCalculatorModal from '../../components/smart/CateringCalculatorModal';
import {
  DollarSign,
  PieChart,
  ShieldAlert,
  PiggyBank,
  Sparkles,
  Calculator,
  Save,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function BudgetPlanner() {
  const { activeWedding, financials, currency, updateActiveWedding } = useWedding();
  const { addToast } = useToast();

  const [cateringModalOpen, setCateringModalOpen] = useState(false);
  const [budgetForm, setBudgetForm] = useState({
    totalBudget: activeWedding?.totalBudget || 2500000,
    brideSideBudget: activeWedding?.brideSideBudget || 1000000,
    groomSideBudget: activeWedding?.groomSideBudget || 1000000,
    sharedBudget: activeWedding?.sharedBudget || 500000,
    emergencyReserve: activeWedding?.emergencyReserve || 100000,
  });

  const [saving, setSaving] = useState(false);

  if (!financials) return null;

  const handleSaveBudgetTargets = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateActiveWedding({
      totalBudget: Number(budgetForm.totalBudget),
      brideSideBudget: Number(budgetForm.brideSideBudget),
      groomSideBudget: Number(budgetForm.groomSideBudget),
      sharedBudget: Number(budgetForm.sharedBudget),
      emergencyReserve: Number(budgetForm.emergencyReserve),
    });
    setSaving(false);
  };

  const categories = financials.categoryBreakdown || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-champagne-600">
            Financial Architecture
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-textDark tracking-tight mt-1">
            Budget Planner & Allocations
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Define high-level budget allocations, emergency reserves, and side splits in {currency}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setCateringModalOpen(true)}
            variant="gold-outline"
            size="sm"
            icon={Calculator}
          >
            Plate Estimator
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Budget"
          value={formatCurrency(financials.totalBudget, currency)}
          subtext="Total Allocated Capital"
          icon={PiggyBank}
        />
        <StatCard
          title="Actual Spending"
          value={formatCurrency(financials.totalActualExpenses, currency)}
          badgeText={`${financials.budgetUtilization.toFixed(1)}%`}
          badgeType={financials.budgetUtilization > 100 ? 'danger' : financials.budgetUtilization > 80 ? 'warning' : 'gold'}
          subtext="Committed Expenses"
          icon={DollarSign}
        />
        <StatCard
          title="Variance"
          value={formatCurrency(financials.budgetVariance, currency)}
          badgeText={financials.budgetVariance > 0 ? 'Over Budget' : 'Under Budget'}
          badgeType={financials.budgetVariance > 0 ? 'danger' : 'success'}
          subtext="Actual - Planned"
          icon={ShieldAlert}
        />
        <StatCard
          title="Family Contributions"
          value={formatCurrency(financials.totalContributions, currency)}
          badgeText="Funding"
          badgeType="success"
          subtext="Parental Support Received"
          icon={Sparkles}
        />
      </div>

      {/* Budget Allocation Editor */}
      <Card title="Adjust Budget Allocation Targets">
        <form onSubmit={handleSaveBudgetTargets} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <Input
              label={`Total Budget (${currency})`}
              type="number"
              min={0}
              value={budgetForm.totalBudget}
              onChange={(e) => setBudgetForm({ ...budgetForm, totalBudget: e.target.value })}
            />
            <Input
              label={`Bride Side (${currency})`}
              type="number"
              min={0}
              value={budgetForm.brideSideBudget}
              onChange={(e) => setBudgetForm({ ...budgetForm, brideSideBudget: e.target.value })}
            />
            <Input
              label={`Groom Side (${currency})`}
              type="number"
              min={0}
              value={budgetForm.groomSideBudget}
              onChange={(e) => setBudgetForm({ ...budgetForm, groomSideBudget: e.target.value })}
            />
            <Input
              label={`Shared (${currency})`}
              type="number"
              min={0}
              value={budgetForm.sharedBudget}
              onChange={(e) => setBudgetForm({ ...budgetForm, sharedBudget: e.target.value })}
            />
            <Input
              label={`Contingency / Emergency`}
              type="number"
              min={0}
              value={budgetForm.emergencyReserve}
              onChange={(e) => setBudgetForm({ ...budgetForm, emergencyReserve: e.target.value })}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm" isLoading={saving} icon={Save}>
              Save Budget Allocations
            </Button>
          </div>
        </form>
      </Card>

      {/* Category Budget Performance Table */}
      <Card title="Category Spending Performance">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 uppercase font-semibold">
                <th className="pb-3">Category</th>
                <th className="pb-3">Actual Spending</th>
                <th className="pb-3">Paid Advances</th>
                <th className="pb-3">Outstanding</th>
                <th className="pb-3">Items Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {categories.map((cat, idx) => (
                <tr key={idx} className="hover:bg-stone-50/50">
                  <td className="py-3 font-semibold text-textDark">{cat.name}</td>
                  <td className="py-3 font-bold text-stone-900">{formatCurrency(cat.actual, currency)}</td>
                  <td className="py-3 font-semibold text-emerald-700">{formatCurrency(cat.paid, currency)}</td>
                  <td className="py-3 text-stone-600">{formatCurrency(cat.outstanding, currency)}</td>
                  <td className="py-3 text-stone-500">{cat.count} items</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Plate Estimator Modal */}
      <CateringCalculatorModal
        isOpen={cateringModalOpen}
        onClose={() => setCateringModalOpen(false)}
      />
    </div>
  );
}

