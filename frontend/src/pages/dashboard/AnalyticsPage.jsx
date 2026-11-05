import React from 'react';
import { useWedding } from '../../contexts/WeddingContext';
import { formatCurrency } from '../../utils/currency';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, TrendingUp, PiggyBank, DollarSign } from 'lucide-react';

export default function AnalyticsPage() {
  const { financials, currency } = useWedding();

  if (!financials) return null;

  const COLORS = ['#C9A46A', '#D4B685', '#E8D5D0', '#16A34A', '#99733F', '#B07D72', '#DC2626', '#3B82F6'];

  const categoryData = (financials.categoryBreakdown || [])
    .filter((c) => c.actual > 0)
    .map((c) => ({
      name: c.name,
      amount: c.actual,
    }));

  const sideSplitsData = [
    { name: 'Bride Expenses', amount: financials.brideExpenses },
    { name: 'Groom Expenses', amount: financials.groomExpenses },
    { name: 'Shared Expenses', amount: financials.sharedExpenses },
  ];

  const budgetComparison = [
    { name: 'Total Budget', value: financials.totalBudget },
    { name: 'Estimated', value: financials.totalEstimatedExpenses },
    { name: 'Actual Spent', value: financials.totalActualExpenses },
    { name: 'Paid to Date', value: financials.totalPaid },
    { name: 'Outstanding', value: financials.totalOutstanding },
  ];

  const contributionsData = Object.entries(financials.contributionsBySide || {})
    .filter(([_, val]) => val > 0)
    .map(([key, val]) => ({
      name: key,
      value: val,
    }));

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <span className="text-xs font-semibold uppercase tracking-wider text-champagne-600">
          Financial Intelligence
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-textDark tracking-tight mt-1">
          Wedding Analytics & Charts
        </h1>
        <p className="text-xs text-textMuted mt-1">
          Visual breakdowns of spending allocations, family contributions, and payment ratios in {currency}.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Budget Target"
          value={formatCurrency(financials.totalBudget, currency)}
          subtext="Budget limit"
          icon={PiggyBank}
        />
        <StatCard
          title="Actual Spending"
          value={formatCurrency(financials.totalActualExpenses, currency)}
          badgeText={`${financials.budgetUtilization.toFixed(1)}%`}
          badgeType={financials.budgetUtilization > 100 ? 'danger' : 'gold'}
          subtext="Total committed"
          icon={TrendingUp}
        />
        <StatCard
          title="Total Paid"
          value={formatCurrency(financials.totalPaid, currency)}
          badgeText="Paid"
          badgeType="success"
          subtext="Cleared payments"
          icon={DollarSign}
        />
        <StatCard
          title="Family Funding Received"
          value={formatCurrency(financials.totalContributions, currency)}
          badgeText="Contributions"
          badgeType="success"
          subtext="Total support received"
          icon={BarChart3}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card title="Category Expense Distribution">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="amount"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => formatCurrency(val, currency)}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Budget vs Actual vs Outstanding Bar Chart */}
        <Card title="Capital Flow & Settlement Progress">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetComparison} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <XAxis dataKey="name" fontSize={11} stroke="#78716C" angle={-15} textAnchor="end" />
                <YAxis fontSize={10} stroke="#78716C" />
                <Tooltip
                  formatter={(val) => formatCurrency(val, currency)}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="value" fill="#C9A46A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Side-by-side ownership chart */}
        <Card title="Bride vs Groom vs Shared Allocations">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sideSplitsData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <XAxis dataKey="name" fontSize={11} stroke="#78716C" />
                <YAxis fontSize={10} stroke="#78716C" />
                <Tooltip
                  formatter={(val) => formatCurrency(val, currency)}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="amount" fill="#D4B685" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Family Contributions Breakdown */}
        <Card title="Family Funding by Side">
          {contributionsData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contributionsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {contributionsData.map((_, index) => (
                      <Cell key={`cell-c-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => formatCurrency(val, currency)}
                    contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-xs text-stone-400">
              No family contributions recorded yet.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

