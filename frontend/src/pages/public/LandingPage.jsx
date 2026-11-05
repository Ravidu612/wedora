import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import {
  Sparkles,
  Heart,
  DollarSign,
  Users,
  Mail,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Crown,
  ArrowRight,
  PieChart,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 lg:pb-24">
        {/* Soft decorative background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-champagne-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-dustyRose-200/40 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-50 border border-champagne-200 text-champagne-800 text-xs font-semibold tracking-wide shadow-sm">
            <Crown className="w-3.5 h-3.5 text-champagne-600" />
            <span>Sri Lanka & Global Premium Wedding Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-textDark tracking-tight leading-[1.15]">
            Your Entire Wedding, <br />
            <span className="gold-gradient-text italic">Beautifully Planned.</span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-textMuted font-light leading-relaxed">
            Plan your wedding, manage every expense, organize guests, and celebrate without the chaos. From Poruwa ceremonies to grand receptions.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/register">
              <Button size="lg" variant="primary" icon={Sparkles} className="w-full sm:w-auto shadow-premium text-base px-8 py-4">
                Start Planning Your Wedding
              </Button>
            </Link>
            <Link to="/features">
              <Button size="lg" variant="secondary" icon={ArrowRight} className="w-full sm:w-auto text-base px-7 py-4">
                Explore Features
              </Button>
            </Link>
          </div>

          {/* Trust points */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-stone-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Default LKR & Multi-Currency</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Bride & Groom Split Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Free Digital Invitations & RSVP</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DASHBOARD PREVIEW SHOWCASE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-champagne-200/60 to-stone-200/40 border border-champagne-300 shadow-2xl">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-inner border border-stone-100">
            {/* Mock Dashboard Topbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-stone-100 gap-4">
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-champagne-600 uppercase">
                  Wedding Workspace Preview
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-textDark">
                  Kavinda & Senuri's Royal Kandyan Wedding
                </h3>
                <p className="text-xs text-textMuted">Cinnamon Grand Ballroom, Colombo • 14 November 2026</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-champagne-50 border border-champagne-200 text-champagne-800 text-xs font-semibold rounded-full">
                  142 Days Countdown
                </span>
              </div>
            </div>

            {/* Mock Stat Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-[11px] text-textMuted uppercase font-semibold">Total Budget</span>
                <div className="text-xl font-serif font-bold text-textDark mt-1">Rs. 3,500,000</div>
                <span className="text-[10px] text-emerald-700 font-medium">Allocated Budget</span>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-[11px] text-textMuted uppercase font-semibold">Actual Expenses</span>
                <div className="text-xl font-serif font-bold text-champagne-700 mt-1">Rs. 2,820,000</div>
                <span className="text-[10px] text-champagne-700 font-medium">80.5% Utilized</span>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-[11px] text-textMuted uppercase font-semibold">Bride Side</span>
                <div className="text-xl font-serif font-bold text-textDark mt-1">Rs. 1,150,000</div>
                <span className="text-[10px] text-stone-500 font-medium">Osariya, Jewellery, Salon</span>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-[11px] text-textMuted uppercase font-semibold">Groom Side</span>
                <div className="text-xl font-serif font-bold text-textDark mt-1">Rs. 980,000</div>
                <span className="text-[10px] text-stone-500 font-medium">Nilame Suit, Homecoming</span>
              </div>
            </div>

            {/* Mock Progress Bars */}
            <div className="space-y-2 bg-ivory p-4 rounded-xl border border-stone-200/60">
              <div className="flex justify-between text-xs font-semibold text-textDark">
                <span>Budget Utilization Progress</span>
                <span className="text-champagne-700 font-bold">80.5% (Rs. 680,000 Remaining)</span>
              </div>
              <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-champagne-500 h-full rounded-full w-[80.5%]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUE PROPOSITION FEATURES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-champagne-600">
            Tailored For Modern & Traditional Couples
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-textDark">
            Every Aspect of Your Wedding, Seamlessly Organized
          </h2>
          <p className="text-sm text-textMuted leading-relaxed">
            No more scattered spreadsheets, lost receipts, or confusion over who is paying what. Wedora handles every financial and operational detail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-champagne-100 border border-champagne-200 flex items-center justify-center text-champagne-600 mb-5">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-textDark mb-2">
              Precise Financial Calculation Engine
            </h3>
            <p className="text-xs text-textMuted leading-relaxed mb-4">
              Real-time calculations for estimated vs actual spending, paid amounts, outstanding balances, and intelligent warnings before you exceed your budget.
            </p>
            <div className="text-xs font-semibold text-champagne-700">LKR default • Integer/decimal accuracy</div>
          </Card>

          <Card className="hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-dustyRose-100 border border-dustyRose-200 flex items-center justify-center text-dustyRose-500 mb-5">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-textDark mb-2">
              Bride vs. Groom Side Splits
            </h3>
            <p className="text-xs text-textMuted leading-relaxed mb-4">
              Clear distinction between Bride expenses (Osariya, bridal jewellery, salon), Groom expenses (Nilame attire, suits), and shared costs like venue and catering.
            </p>
            <div className="text-xs font-semibold text-dustyRose-500">Track family contributions separately</div>
          </Card>

          <Card className="hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-champagne-100 border border-champagne-200 flex items-center justify-center text-champagne-600 mb-5">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-textDark mb-2">
              Digital Invitations & Instant RSVP
            </h3>
            <p className="text-xs text-textMuted leading-relaxed mb-4">
              Create luxury web invitations with personalized URLs and WhatsApp sharing. Guests RSVP with attendee headcounts, plus-ones, and dietary preferences.
            </p>
            <div className="text-xs font-semibold text-champagne-700">Shareable via WhatsApp links</div>
          </Card>
        </div>
      </section>

      {/* 4. SRI LANKAN WEDDING TRADITIONS SHOWCASE */}
      <section className="bg-ivory py-16 border-y border-stone-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-champagne-700">
                Cultural Heritage & Sri Lankan Nuptials
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-textDark leading-tight">
                Designed for Poruwa, Nekath Times, and Homecoming Celebrations
              </h2>
              <p className="text-sm text-textMuted leading-relaxed">
                Whether you are having a traditional Kandyan Poruwa ceremony, Low-country rituals, a Church or Hindu wedding, or a Western reception, Wedora understands the nuances:
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-champagne-500 text-white flex items-center justify-center text-xs mt-0.5">✓</div>
                  <div>
                    <h4 className="text-sm font-semibold text-textDark">Predefined Auspicious Nekath Schedule</h4>
                    <p className="text-xs text-textMuted">Coordinate Poruwa timing, Magul Bera drummers, and register signing down to the minute.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-champagne-500 text-white flex items-center justify-center text-xs mt-0.5">✓</div>
                  <div>
                    <h4 className="text-sm font-semibold text-textDark">Homecoming & Multi-Event Tracking</h4>
                    <p className="text-xs text-textMuted">Separate budgets and guest lists for the main wedding and the Groom-hosted homecoming reception.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-champagne-500 text-white flex items-center justify-center text-xs mt-0.5">✓</div>
                  <div>
                    <h4 className="text-sm font-semibold text-textDark">Family Contributions & Gifts</h4>
                    <p className="text-xs text-textMuted">Keep transparent records of generous gifts and support from parents and relatives.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-champagne-200 shadow-premium space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="font-serif font-bold text-base text-textDark">Traditional Timeline Sequence</span>
                <span className="text-[11px] font-semibold text-champagne-700 bg-champagne-50 px-2 py-0.5 rounded-md">Live Itinerary</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between border border-stone-100">
                  <div className="font-medium text-stone-800">Auspicious Poruwa Ceremony</div>
                  <div className="font-semibold text-champagne-700">09:15 AM</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between border border-stone-100">
                  <div className="font-medium text-stone-800">Legal Marriage Register Signing</div>
                  <div className="font-semibold text-champagne-700">10:15 AM</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between border border-stone-100">
                  <div className="font-medium text-stone-800">Grand Entrance & Champagne Toast</div>
                  <div className="font-semibold text-champagne-700">11:30 AM</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between border border-stone-100">
                  <div className="font-medium text-stone-800">Traditional Baila & Dance Session</div>
                  <div className="font-semibold text-champagne-700">02:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-champagne-600">
            Loved By Couples
          </span>
          <h2 className="text-3xl font-serif font-bold text-textDark mt-1">
            "Planning Our Wedding Without Stress Was Pure Bliss"
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <Card className="bg-white">
            <p className="text-xs text-stone-600 leading-relaxed italic mb-4">
              "Managing the expenses between the Colombo wedding and the Kandy homecoming was causing so much confusion until we started using Wedora. Having every vendor quote, paid advance, and guest RSVP in one place saved us hours of stress!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-champagne-200 text-champagne-800 font-bold flex items-center justify-center text-xs">
                KS
              </div>
              <div>
                <h4 className="text-xs font-bold text-textDark">Kavinda & Senuri</h4>
                <p className="text-[11px] text-textMuted">Married at Cinnamon Grand, Colombo</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white">
            <p className="text-xs text-stone-600 leading-relaxed italic mb-4">
              "The digital invitation with instant WhatsApp links made tracking 250 guests so easy! Guests loved the interactive RSVP, and our caterer was thrilled to get exact headcount and dietary breakdowns weeks ahead."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-dustyRose-200 text-dustyRose-500 font-bold flex items-center justify-center text-xs">
                DP
              </div>
              <div>
                <h4 className="text-xs font-bold text-textDark">Dinuka & Prabhashi</h4>
                <p className="text-[11px] text-textMuted">Married at Earl's Regency, Kandy</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Begin Your Wedding Journey Today
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
              Create your collaborative wedding workspace in less than 2 minutes. Free to start, fully customizable, and designed for celebration.
            </p>
            <div className="pt-2">
              <Link to="/register">
                <Button size="lg" variant="primary" icon={Sparkles} className="shadow-lg">
                  Start Planning Your Wedding
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

