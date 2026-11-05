import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { WeddingProvider } from './contexts/WeddingContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import FeaturesPage from './pages/public/FeaturesPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import PricingPage from './pages/public/PricingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage';
import TermsPage from './pages/public/TermsPage';
import PublicInvitationPage from './pages/public/PublicInvitationPage';

// Authenticated Pages
import WeddingDashboard from './pages/dashboard/WeddingDashboard';
import WeddingSetupWizard from './pages/dashboard/WeddingSetupWizard';
import WeddingOverview from './pages/dashboard/WeddingOverview';
import BudgetPlanner from './pages/dashboard/BudgetPlanner';
import ExpensesPage from './pages/dashboard/ExpensesPage';
import BrideExpensesPage from './pages/dashboard/BrideExpensesPage';
import GroomExpensesPage from './pages/dashboard/GroomExpensesPage';
import FamilyContributionsPage from './pages/dashboard/FamilyContributionsPage';
import PaymentsPage from './pages/dashboard/PaymentsPage';
import GuestManagementPage from './pages/dashboard/GuestManagementPage';
import InvitationsPage from './pages/dashboard/InvitationsPage';
import RSVPManagementPage from './pages/dashboard/RSVPManagementPage';
import VendorManagementPage from './pages/dashboard/VendorManagementPage';
import WeddingChecklistPage from './pages/dashboard/WeddingChecklistPage';
import WeddingTimelinePage from './pages/dashboard/WeddingTimelinePage';
import SeatingPlannerPage from './pages/dashboard/SeatingPlannerPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import ReportsPage from './pages/dashboard/ReportsPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import UserProfilePage from './pages/dashboard/UserProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <WeddingProvider>
            <Routes>
              {/* Public Routes with Navbar and Footer */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
              </Route>

              {/* Public Interactive Digital Invitation & RSVP (No Navbar) */}
              <Route path="/invite/:slug" element={<PublicInvitationPage />} />

              {/* First-time Wedding Setup Wizard */}
              <Route path="/setup-wizard" element={<WeddingSetupWizard />} />

              {/* Authenticated Dashboard Pages with Sidebar & Topbar */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<WeddingDashboard />} />
                <Route path="overview" element={<WeddingOverview />} />
                <Route path="budget" element={<BudgetPlanner />} />
                <Route path="expenses" element={<ExpensesPage />} />
                <Route path="bride-expenses" element={<BrideExpensesPage />} />
                <Route path="groom-expenses" element={<GroomExpensesPage />} />
                <Route path="contributions" element={<FamilyContributionsPage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="guests" element={<GuestManagementPage />} />
                <Route path="invitations" element={<InvitationsPage />} />
                <Route path="rsvp" element={<RSVPManagementPage />} />
                <Route path="vendors" element={<VendorManagementPage />} />
                <Route path="checklist" element={<WeddingChecklistPage />} />
                <Route path="timeline" element={<WeddingTimelinePage />} />
                <Route path="seating" element={<SeatingPlannerPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="profile" element={<UserProfilePage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </WeddingProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

