import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWedding } from '../../contexts/WeddingContext';
import { formatCurrency } from '../../utils/currency';
import { formatDate, getCountdownDetails } from '../../utils/date';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import {
  DollarSign,
  Receipt,
  CreditCard,
  AlertCircle,
  PiggyBank,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar,
  ArrowRight,
  TrendingUp,
  Store,
  ChevronRight,
  Plus,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';

export default function WeddingDashboard() {
  const { activeWedding, financials, currency, expenses, payments } = useWedding();
  const [countdown, setCountdown] = useState(
    getCountdownDetails(activeWedding?.weddingDate)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdownDetails(activeWedding?.weddingDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeWedding?.weddingDate]);

  if (!activeWedding || !financials) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-10 h-10 border-4 border-champagne-300 border-t-champagne-600 rounded-full animate-spin mb-4" />
        <p className="text-xs text-textMuted font-medium">Calculating real-time financial analytics...</p>
      </div>
    );
  }

  // Prepare chart data
  const categoryChartData = (financials.categoryBreakdown || [])
    .filter((c) => c.actual > 0)
    .map((c) => ({
      name: c.name,
      amount: c.actual,
    }))
    .slice(0, 6);

  const COLORS = ['#C9A46A', '#D4B685', '#E8D5D0', '#16A34A', '#99733F', '#B07D72'];

  const sideComparisonData = [
    {
      name: 'Bride Side',
      Actual: financials.brideExpenses + financials.brideFamilyExpenses,
      Paid: financials.ownershipBreakdown?.Bride?.paid || 0,
    },
    {
      name: 'Groom Side',
      Actual: financials.groomExpenses + financials.groomFamilyExpenses,
      Paid: financials.ownershipBreakdown?.Groom?.paid || 0,
    },
    {
      name: 'Shared / Reception',
      Actual: financials.sharedExpenses,
      Paid: financials.ownershipBreakdown?.Shared?.paid || 0,
    },
  ];

  const budgetVsActualData = [
    {
      name: 'Budget Allocated',
      amount: financials.totalBudget,
    },
    {
      name: 'Actual Spending',
      amount: financials.totalActualExpenses,
    },
    {
      name: 'Total Paid',
      amount: financials.totalPaid,
    },
  ];

  // Outstanding payment deadlines
  const upcomingDeadlines = expenses
    .filter((e) => e.paymentDeadline && e.paymentStatus !== 'Paid')
    .sort((a, b) => new Date(a.paymentDeadline) - new Date(b.paymentDeadline))
    .slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. WEDDING COUNTDOWN BANNER */}
      <div className="relative rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-6 sm:p-8 overflow-hidden shadow-premium">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-champagne-400">
              The Grand Celebration
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1">
              {activeWedding.brideName} & {activeWedding.groomName}
            </h2>
            <p className="text-xs text-stone-300 mt-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-champagne-400" />
              <span>{formatDate(activeWedding.weddingDate)}</span>
              <span>•</span>
              <span>{activeWedding.venue || activeWedding.location}</span>
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-white/15">
            <div className="text-center px-2 sm:px-3">
              <div className="text-xl sm:text-2xl font-serif font-bold text-champagne-300">
                {countdown.days}
              </div>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider">Days</div>
            </div>
            <span className="text-stone-500 font-serif">:</span>
            <div className="text-center px-2 sm:px-3">
              <div className="text-xl sm:text-2xl font-serif font-bold text-white">
                {countdown.hours}
              </div>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider">Hours</div>
            </div>
            <span className="text-stone-500 font-serif">:</span>
            <div className="text-center px-2 sm:px-3">
              <div className="text-xl sm:text-2xl font-serif font-bold text-white">
                {countdown.minutes}
              </div>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider">Mins</div>
            </div>
            <span className="text-stone-500 font-serif">:</span>
            <div className="text-center px-2 sm:px-3">
              <div className="text-xl sm:text-2xl font-serif font-bold text-champagne-400">
                {countdown.seconds}
              </div>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider">Secs</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. OVERVIEW FINANCIAL METRIC CARDS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-textMuted">
            Core Financial Performance
          </h3>
          <Link
            to="/dashboard/budget"
            className="text-xs font-semibold text-champagne-700 hover:text-champagne-900 flex items-center gap-1"
          >
            Detailed Budget Planner <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <StatCard
            title="Total Budget"
            value={formatCurrency(financials.totalBudget, currency)}
            subtext="Allocated Target"
            icon={PiggyBank}
          />
          <StatCard
            title="Estimated"
            value={formatCurrency(financials.totalEstimatedExpenses, currency)}
            subtext="Planned Total"
            icon={Receipt}
          />
          <StatCard
            title="Actual Total"
            value={formatCurrency(financials.totalActualExpenses, currency)}
            badgeText={`${financials.budgetUtilization.toFixed(0)}%`}
            badgeType={financials.budgetUtilization > 100 ? 'danger' : financials.budgetUtilization > 80 ? 'warning' : 'gold'}
            subtext="Current Total"
            icon={TrendingUp}
          />
          <StatCard
            title="Total Paid"
            value={formatCurrency(financials.totalPaid, currency)}
            badgeText="Paid"
            badgeType="success"
            subtext="Verified Advances"
            icon={CreditCard}
          />
          <StatCard
            title="Outstanding"
            value={formatCurrency(financials.totalOutstanding, currency)}
            badgeText={financials.totalOutstanding > 0 ? 'Pending' : 'Settled'}
            badgeType={financials.totalOutstanding > 0 ? 'warning' : 'success'}
            subtext="Balance to Pay"
            icon={AlertCircle}
          />
          <StatCard
            title="Remaining"
            value={formatCurrency(financials.remainingBudget, currency)}
            badgeText={financials.remainingBudget < 0 ? 'Deficit' : 'Surplus'}
            badgeType={financials.remainingBudget < 0 ? 'danger' : 'success'}
            subtext="Left to Spend"
            icon={DollarSign}
          />
        </div>
      </div>

      {/* 3. WEDDING UTILIZATION & SIDE ALLOCATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Utilization Bar */}
        <Card className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-serif font-bold text-base text-textDark">
                Budget Utilization & Side Splits
              </h3>
              <p className="text-xs text-textMuted mt-0.5">
                Real-time tracking of couple commitments and family funding
              </p>
            </div>
            <span className="text-xs font-bold text-champagne-800 bg-champagne-50 px-3 py-1 rounded-full border border-champagne-200">
              {financials.budgetUtilization.toFixed(1)}% Used
            </span>
          </div>

          {/* Utilization Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-textDark font-medium">
              <span>{formatCurrency(financials.totalActualExpenses, currency)} Spent</span>
              <span>{formatCurrency(financials.totalBudget, currency)} Target</span>
            </div>
            <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  financials.budgetUtilization > 100
                    ? 'bg-rose-500'
                    : financials.budgetUtilization > 80
                    ? 'bg-amber-500'
                    : 'bg-champagne-500'
                }`}
                style={{ width: `${Math.min(100, financials.budgetUtilization)}%` }}
              />
            </div>
          </div>

          {/* Side by side mini statistics */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <div className="text-[11px] font-semibold text-textMuted uppercase">Bride Side</div>
              <div className="text-sm sm:text-base font-serif font-bold text-textDark mt-1">
                {formatCurrency(financials.brideExpenses, currency)}
              </div>
              <div className="text-[10px] text-textMuted mt-0.5">Osariya & Styling</div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <div className="text-[11px] font-semibold text-textMuted uppercase">Groom Side</div>
              <div className="text-sm sm:text-base font-serif font-bold text-textDark mt-1">
                {formatCurrency(financials.groomExpenses, currency)}
              </div>
              <div className="text-[10px] text-textMuted mt-0.5">Nilame & Suits</div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <div className="text-[11px] font-semibold text-textMuted uppercase">Family Received</div>
              <div className="text-sm sm:text-base font-serif font-bold text-emerald-700 mt-1">
                {formatCurrency(financials.totalContributions, currency)}
              </div>
              <div className="text-[10px] text-textMuted mt-0.5">Contributions</div>
            </div>
          </div>
        </Card>

        {/* Savings Planner Suggestion */}
        <Card className="flex flex-col justify-between space-y-4 bg-gradient-to-br from-white to-ivory border-champagne-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-champagne-50 text-champagne-800 text-[11px] font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Savings Projection</span>
            </div>
            <h3 className="font-serif font-bold text-base text-textDark">
              Monthly Savings Required
            </h3>
            <p className="text-xs text-textMuted mt-1 leading-relaxed">
              Based on remaining funding requirement of{' '}
              <strong className="text-stone-800">{formatCurrency(financials.savingsPlanner.netRequiredFunding, currency)}</strong> over {financials.savingsPlanner.remainingMonths} months:
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-champagne-300 text-center shadow-sm">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-champagne-700">
              {formatCurrency(financials.savingsPlanner.monthlySavingsRequired, currency)}
            </div>
            <div className="text-[11px] text-stone-500 mt-1 uppercase tracking-wider font-semibold">
              Per Month Until Wedding
            </div>
          </div>

          <Link to="/dashboard/budget" className="w-full">
            <Button variant="gold-outline" size="sm" className="w-full">
              Open Financial Breakdown
            </Button>
          </Link>
        </Card>
      </div>

      {/* 4. CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Chart */}
        <Card title="Top Expenses by Category">
          {categoryChartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="amount"
                  >
                    {categoryChartData.map((entry, index) => (
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
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-xs text-textMuted">
              <Receipt className="w-8 h-8 text-stone-300 mb-2" />
              <span>No recorded expenses yet. Click "Add Expense" to start.</span>
            </div>
          )}
        </Card>

        {/* Side Comparison Chart */}
        <Card title="Bride vs Groom vs Reception Splits">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sideComparisonData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" fontSize={11} stroke="#78716C" />
                <YAxis fontSize={10} stroke="#78716C" />
                <Tooltip
                  formatter={(val) => formatCurrency(val, currency)}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Actual" fill="#C9A46A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Paid" fill="#16A34A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 5. UPCOMING DEADLINES & RECENT TRANSACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Deadlines */}
        <Card
          title="Upcoming Payment Deadlines"
          action={
            <Link to="/dashboard/payments" className="text-xs font-semibold text-champagne-700 hover:underline">
              View All
            </Link>
          }
        >
          {upcomingDeadlines.length > 0 ? (
            <div className="divide-y divide-stone-100">
              {upcomingDeadlines.map((item) => (
                <div key={item._id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-textDark">{item.name}</h4>
                    <p className="text-[11px] text-textMuted flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Due: {formatDate(item.paymentDeadline)}</span>
                      <span>•</span>
                      <span>{item.category}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-textDark">
                      {formatCurrency((item.actualAmount || item.estimatedAmount) - (item.paidAmount || 0), currency)}
                    </div>
                    <Badge variant={item.paymentStatus} size="sm">
                      {item.paymentStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-textMuted">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <span>All payment deadlines are currently up to date!</span>
            </div>
          )}
        </Card>

        {/* Quick Actions & Navigation */}
        <Card title="Quick Wedding Shortcuts">
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/dashboard/expenses"
              className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-champagne-50 hover:border-champagne-300 transition-all flex flex-col justify-between"
            >
              <Receipt className="w-5 h-5 text-champagne-600 mb-2" />
              <div>
                <h4 className="text-xs font-bold text-textDark">Add Expense</h4>
                <p className="text-[10px] text-textMuted mt-0.5">Record quotes & bills</p>
              </div>
            </Link>

            <Link
              to="/dashboard/guests"
              className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-champagne-50 hover:border-champagne-300 transition-all flex flex-col justify-between"
            >
              <Users className="w-5 h-5 text-champagne-600 mb-2" />
              <div>
                <h4 className="text-xs font-bold text-textDark">Guest List</h4>
                <p className="text-[10px] text-textMuted mt-0.5">RSVP & Headcounts</p>
              </div>
            </Link>

            <Link
              to="/dashboard/invitations"
              className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-champagne-50 hover:border-champagne-300 transition-all flex flex-col justify-between"
            >
              <Sparkles className="w-5 h-5 text-champagne-600 mb-2" />
              <div>
                <h4 className="text-xs font-bold text-textDark">Digital Invite</h4>
                <p className="text-[10px] text-textMuted mt-0.5">Share WhatsApp link</p>
              </div>
            </Link>

            <Link
              to="/dashboard/reports"
              className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-champagne-50 hover:border-champagne-300 transition-all flex flex-col justify-between"
            >
              <DollarSign className="w-5 h-5 text-champagne-600 mb-2" />
              <div>
                <h4 className="text-xs font-bold text-textDark">Download PDF</h4>
                <p className="text-[10px] text-textMuted mt-0.5">Full budget statement</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

