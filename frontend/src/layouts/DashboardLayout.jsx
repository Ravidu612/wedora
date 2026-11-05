import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWedding } from '../contexts/WeddingContext';
import Sidebar from '../components/layout/Sidebar';
import Button from '../components/common/Button';
import {
  Menu,
  X,
  Plus,
  AlertTriangle,
  Sparkles,
  Calendar,
  Share2,
} from 'lucide-react';
import { formatDate } from '../utils/date';

export default function DashboardLayout() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { activeWedding, financials, loading: weddingLoading } = useWedding();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-pageBg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-champagne-200 border-t-champagne-500 rounded-full animate-spin" />
          <p className="text-xs font-medium text-stone-500">Loading your wedding workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If user has no weddings created yet and isn't on the setup wizard page, guide them to wizard
  if (!weddingLoading && !activeWedding && location.pathname !== '/setup-wizard') {
    return <Navigate to="/setup-wizard" replace />;
  }

  const warnings = financials?.warnings || [];

  return (
    <div className="min-h-screen bg-pageBg flex overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0 shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 bg-white h-full shadow-2xl">
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200/60 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {activeWedding ? (
              <div>
                <h1 className="text-base sm:text-lg font-serif font-bold text-textDark tracking-tight flex items-center gap-2">
                  <span>{activeWedding.brideName} & {activeWedding.groomName}</span>
                </h1>
                <div className="flex items-center gap-2 text-xs text-textMuted">
                  <Calendar className="w-3.5 h-3.5 text-champagne-600" />
                  <span>{formatDate(activeWedding.weddingDate)}</span>
                  <span>•</span>
                  <span>{activeWedding.venue || activeWedding.location}</span>
                </div>
              </div>
            ) : (
              <span className="font-serif font-semibold text-textDark">Wedding Setup</span>
            )}
          </div>

          {/* Quick Header Actions */}
          {activeWedding && (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/dashboard/expenses">
                <Button variant="primary" size="sm" icon={Plus}>
                  <span className="hidden sm:inline">Add Expense</span>
                  <span className="sm:hidden">Expense</span>
                </Button>
              </Link>
            </div>
          )}
        </header>

        {/* Real-time Budget Warning Banner */}
        {warnings.length > 0 && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-8 py-2.5 flex items-center gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="flex-1 font-medium">
              {warnings.map((w, idx) => (
                <span key={idx}>{w.message} </span>
              ))}
            </div>
            <Link to="/dashboard/budget" className="font-semibold underline text-amber-800 hover:text-amber-950">
              View Budget
            </Link>
          </div>
        )}

        {/* Nested Content Route */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

