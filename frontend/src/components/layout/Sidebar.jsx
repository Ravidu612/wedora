import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useWedding } from '../../contexts/WeddingContext';
import { useAuth } from '../../contexts/AuthContext';
import { getDaysUntil } from '../../utils/date';
import {
  LayoutDashboard,
  CalendarHeart,
  DollarSign,
  Receipt,
  Sparkles,
  Shirt,
  HandCoins,
  CreditCard,
  Users,
  Mail,
  UserCheck,
  Store,
  CheckSquare,
  Clock,
  Armchair,
  BarChart3,
  FileText,
  Settings,
  User,
  PlusCircle,
  Heart,
  LogOut,
} from 'lucide-react';

export default function Sidebar({ onCloseMobile }) {
  const { activeWedding, weddings, selectWedding } = useWedding();
  const { user, logout } = useAuth();

  const daysLeft = activeWedding ? getDaysUntil(activeWedding.weddingDate) : 0;

  const navigation = [
    {
      group: 'Overview',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Wedding Overview', href: '/dashboard/overview', icon: CalendarHeart },
      ],
    },
    {
      group: 'Financial Management',
      items: [
        { name: 'Budget Planner', href: '/dashboard/budget', icon: DollarSign },
        { name: 'All Expenses', href: '/dashboard/expenses', icon: Receipt },
        { name: 'Bride Expenses', href: '/dashboard/bride-expenses', icon: Sparkles },
        { name: 'Groom Expenses', href: '/dashboard/groom-expenses', icon: Shirt },
        { name: 'Family Contributions', href: '/dashboard/contributions', icon: HandCoins },
        { name: 'Payment Tracking', href: '/dashboard/payments', icon: CreditCard },
      ],
    },
    {
      group: 'Guests & Invitations',
      items: [
        { name: 'Guest List', href: '/dashboard/guests', icon: Users },
        { name: 'Digital Invitations', href: '/dashboard/invitations', icon: Mail },
        { name: 'RSVP Management', href: '/dashboard/rsvp', icon: UserCheck },
        { name: 'Seating Planner', href: '/dashboard/seating', icon: Armchair },
      ],
    },
    {
      group: 'Coordination',
      items: [
        { name: 'Vendors', href: '/dashboard/vendors', icon: Store },
        { name: 'Wedding Checklist', href: '/dashboard/checklist', icon: CheckSquare },
        { name: 'Day Timeline', href: '/dashboard/timeline', icon: Clock },
      ],
    },
    {
      group: 'Intelligence & Reports',
      items: [
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
        { name: 'PDF Reports', href: '/dashboard/reports', icon: FileText },
      ],
    },
    {
      group: 'Account & Settings',
      items: [
        { name: 'Wedding Settings', href: '/dashboard/settings', icon: Settings },
        { name: 'My Profile', href: '/dashboard/profile', icon: User },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-stone-200/80 flex flex-col h-full select-none">
      {/* Brand & Active Wedding Card */}
      <div className="p-5 border-b border-stone-100 bg-ivory/60">
        <Link to="/" className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-champagne-100 border border-champagne-300 flex items-center justify-center text-champagne-600 shadow-sm">
            <Heart className="w-4 h-4 fill-champagne-500/20 text-champagne-600" />
          </div>
          <div>
            <span className="text-xl font-serif font-bold text-textDark tracking-tight">
              Wedora
            </span>
          </div>
        </Link>

        {/* Wedding Switcher Card */}
        {activeWedding ? (
          <div className="bg-white rounded-xl p-3 border border-champagne-200 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-champagne-700 uppercase tracking-wider">
                Active Wedding
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-champagne-50 text-champagne-800 border border-champagne-200">
                {daysLeft > 0 ? `${daysLeft} days left` : 'Wedding Day'}
              </span>
            </div>
            <div className="font-serif font-bold text-sm text-textDark truncate">
              {activeWedding.brideName} & {activeWedding.groomName}
            </div>

            {weddings.length > 1 && (
              <select
                value={activeWedding._id}
                onChange={(e) => selectWedding(e.target.value)}
                className="mt-2 block w-full text-xs py-1 px-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 focus:outline-none"
              >
                {weddings.map((w) => (
                  <option key={w._id} value={w._id}>
                    {w.brideName} & {w.groomName}
                  </option>
                ))}
              </select>
            )}
          </div>
        ) : (
          <Link
            to="/setup-wizard"
            className="flex items-center gap-2 text-xs font-semibold text-champagne-700 p-2.5 rounded-xl bg-champagne-50 border border-champagne-200 hover:bg-champagne-100 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Wedding Workspace</span>
          </Link>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigation.map((group) => (
          <div key={group.group}>
            <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              {group.group}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === '/dashboard'}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-champagne-50 text-champagne-800 font-semibold shadow-sm border border-champagne-200/80'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 shrink-0 text-stone-500" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User profile footer */}
      <div className="p-3 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-champagne-200 flex items-center justify-center text-champagne-800 font-semibold text-xs shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-semibold text-textDark truncate">
              {user?.name || 'Wedding Planner'}
            </div>
            <div className="text-[10px] text-textMuted truncate">
              {user?.email}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          title="Log out"
          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}

