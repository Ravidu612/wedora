import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Sparkles, Calendar, DollarSign, Users, CheckCircle2 } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      step: '01',
      title: 'Create Your Workspace & Setup Wizard',
      desc: 'Sign up in seconds, enter Bride and Groom names, your wedding date, location, and total budget. The setup wizard automatically configures default expense categories and ceremony events tailored for your wedding.',
      icon: Calendar,
    },
    {
      step: '02',
      title: 'Plan Budgets & Track Every Expense',
      desc: 'Allocate spending targets across venues, catering, photography, bridal attire, and entertainment. Record quoted prices, track advance deposits, and let Wedora calculate remaining balances and warning alerts in real-time.',
      icon: DollarSign,
    },
    {
      step: '03',
      title: 'Invite Guests & Send Digital Invitations',
      desc: 'Build your guest list or import it via CSV. Launch a personalized digital invitation link that you can share via WhatsApp. Guests confirm attendance, attendees headcounts, and dietary preferences instantly.',
      icon: Users,
    },
    {
      step: '04',
      title: 'Coordinate Vendors & Wedding Day Timeline',
      desc: 'Follow the pre-populated Sri Lankan & modern wedding checklist from 12 months out to wedding day. Finalize table seating and run through your master day timeline with ease.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-champagne-600">
          The Wedora Blueprint
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-textDark">
          How Wedora Works
        </h1>
        <p className="text-base text-textMuted leading-relaxed">
          Four simple steps to turn wedding chaos into a beautifully organized celebration.
        </p>
      </div>

      <div className="space-y-8">
        {steps.map((s, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-start gap-6 p-8 bg-white rounded-2xl border border-stone-100 shadow-soft"
          >
            <div className="text-3xl font-serif font-bold text-champagne-500 bg-champagne-50 border border-champagne-200 rounded-2xl w-16 h-16 flex items-center justify-center shrink-0">
              {s.step}
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-xl font-serif font-bold text-textDark">
                {s.title}
              </h3>
              <p className="text-sm text-textMuted leading-relaxed">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-8">
        <Link to="/register">
          <Button size="lg" variant="primary" icon={Sparkles}>
            Start Your Free Wedding Workspace
          </Button>
        </Link>
      </div>
    </div>
  );
}

