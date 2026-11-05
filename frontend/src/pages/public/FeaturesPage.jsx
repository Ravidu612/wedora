import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import {
  DollarSign,
  Users,
  Mail,
  Store,
  CheckSquare,
  Clock,
  Armchair,
  BarChart3,
  FileText,
  Sparkles,
  ShieldCheck,
  Calculator,
} from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: DollarSign,
      title: 'Precision Budget & Expense Engine',
      desc: 'Centralized financial calculation engine that prevents double-counting, alerts when nearing or exceeding 80% and 100% budget thresholds, and calculates exact remaining balances in LKR or your chosen currency.',
    },
    {
      icon: Sparkles,
      title: 'Dedicated Bride & Groom Modules',
      desc: 'Independent tracking for Osariya, bridal gown, jewellery, makeup, Kandyan Nilame attire, grooming, and groomsmen costs, allowing clear visibility into who is financing each wedding element.',
    },
    {
      icon: Users,
      title: 'Guest List & Dietary Management',
      desc: 'Categorize guests (Bride Family, Groom Family, Friends, VIP), track plus-ones, children, and specific dietary needs (Vegetarian, Vegan, Halal, etc.) with CSV import and export capabilities.',
    },
    {
      icon: Mail,
      title: 'Digital Invitation Designer',
      desc: 'Generate gorgeous online invitations with customizable typography, colors, background patterns, and event schedules. Guests can RSVP in seconds from their phones.',
    },
    {
      icon: Calculator,
      title: 'Smart Catering Plate Estimator',
      desc: 'Simulate catering expenditures with adult and child plate prices, 10% hotel service charges, and venue taxes to predict food and beverage bills accurately.',
    },
    {
      icon: Armchair,
      title: 'Seating Planner & Table Arrangements',
      desc: 'Design tables (Round, Rectangular, Head Table), specify seat capacities, assign guests, and prevent overbooked tables or duplicate seating.',
    },
    {
      icon: Store,
      title: 'Vendor Booking & Quotations Tracker',
      desc: 'Compare quotes across photographers, videographers, decorators, reception halls, florists, and DJs. Record contract advances and track remaining balance deadlines.',
    },
    {
      icon: CheckSquare,
      title: 'Pre-Loaded Sri Lankan Wedding Checklist',
      desc: 'Over 25 built-in tasks organized into timeline buckets: 12 months, 9 months, 6 months, 3 months, 1 month, 1 week, and wedding day, covering cultural essentials.',
    },
    {
      icon: Clock,
      title: 'Wedding Day Master Itinerary',
      desc: 'Coordinate auspicious Nekath times, Poruwa ceremony rituals, registry signing, photo sessions, cake cutting, and going away times in chronological order.',
    },
    {
      icon: BarChart3,
      title: 'Interactive Analytics & Recharts',
      desc: 'Visualize your spending breakdown by category, side comparison, budget vs. actual variance, payment statuses, and guest RSVP response rates.',
    },
    {
      icon: FileText,
      title: 'One-Click PDF & CSV Reports',
      desc: 'Generate high-resolution printable PDF financial statements for your records or bank loans, and export full guest attendance lists to CSV spreadsheets.',
    },
    {
      icon: ShieldCheck,
      title: 'Collaborative Workspace Security',
      desc: 'Invite your fiancé or authorized family members to plan together with permission-controlled workspaces and secure JWT authentication.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-champagne-600">
          Comprehensive Capabilities
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-textDark">
          Everything You Need to Plan Your Dream Wedding
        </h1>
        <p className="text-base text-textMuted leading-relaxed">
          From first budget estimates to wedding day execution, discover all the features built into Wedora.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <Card key={i} className="hover:-translate-y-1 transition-all">
            <div className="w-11 h-11 rounded-xl bg-champagne-50 border border-champagne-200 flex items-center justify-center text-champagne-600 mb-4">
              <f.icon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-textDark mb-2">
              {f.title}
            </h3>
            <p className="text-xs text-textMuted leading-relaxed">
              {f.desc}
            </p>
          </Card>
        ))}
      </div>

      {/* CTA Box */}
      <div className="bg-ivory rounded-3xl p-10 border border-champagne-300 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-textDark">
          Ready to experience stress-free wedding planning?
        </h2>
        <p className="text-xs sm:text-sm text-textMuted max-w-lg mx-auto">
          Join hundreds of couples already organizing their wedding finances and celebrations with Wedora.
        </p>
        <div className="pt-2">
          <Link to="/register">
            <Button size="lg" variant="primary" icon={Sparkles}>
              Get Started for Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

