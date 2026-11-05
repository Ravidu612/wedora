import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Check, Sparkles } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Essential Wedding',
      price: 'Free',
      period: 'Forever Free during Public Beta',
      description: 'Ideal for couples who want full control over their wedding budget and basic guest list.',
      features: [
        'Complete Centralized Budget Engine',
        'Bride & Groom Expense Tracking',
        'Up to 300 Guests Management',
        'Standard Digital Invitation Template',
        'Basic RSVP Tracking',
        'Sri Lankan Wedding Checklist',
        'Real-time Budget Alert Warnings',
      ],
      cta: 'Get Started Free',
      highlight: false,
    },
    {
      name: 'Royal Celebrations (Pro)',
      price: 'Rs. 4,900',
      period: 'One-time fee per wedding workspace',
      description: 'For couples wanting the ultimate luxury planning experience with unlimited guests & PDF exports.',
      features: [
        'Everything in Essential, plus:',
        'Unlimited Guests & CSV Bulk Import/Export',
        'All 5 Premium Luxury Invitation Templates',
        'Visual Seating Planner & Table Arrangements',
        'Smart Catering Plate Estimator',
        'Monthly Savings Target Planner',
        'Printable Executive PDF Reports',
        'Collaborator & Partner Multi-User Access',
      ],
      cta: 'Start Pro Trial (Free in Beta)',
      highlight: true,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-champagne-600">
          Transparent Investment
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-textDark">
          Simple, Fair Pricing for Every Wedding
        </h1>
        <p className="text-base text-textMuted leading-relaxed">
          No subscriptions, no hidden fees. All core wedding planning features are currently 100% free while in active beta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
        {plans.map((p, idx) => (
          <Card
            key={idx}
            className={`flex flex-col justify-between ${
              p.highlight ? 'border-champagne-400 ring-2 ring-champagne-200/50 shadow-premium' : ''
            }`}
          >
            <div className="space-y-6">
              {p.highlight && (
                <div className="inline-block px-3 py-1 rounded-full bg-champagne-100 text-champagne-800 text-[11px] font-bold uppercase tracking-wider">
                  Most Popular for Sri Lankan Nuptials
                </div>
              )}
              <div>
                <h3 className="text-xl font-serif font-bold text-textDark">{p.name}</h3>
                <p className="text-xs text-textMuted mt-1">{p.description}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-serif font-bold text-textDark">{p.price}</span>
                <span className="text-xs text-textMuted">{p.period}</span>
              </div>

              <ul className="space-y-3 pt-4 border-t border-stone-100 text-xs text-stone-700">
                {p.features.map((f, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t border-stone-100">
              <Link to="/register" className="block">
                <Button
                  variant={p.highlight ? 'primary' : 'outline'}
                  size="lg"
                  className="w-full"
                  icon={p.highlight ? Sparkles : undefined}
                >
                  {p.cta}
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

