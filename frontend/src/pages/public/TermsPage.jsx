import React from 'react';
import Card from '../../components/common/Card';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-serif font-bold text-textDark">Terms of Service</h1>
        <p className="text-xs text-textMuted">Last updated: November 2026</p>
      </div>

      <Card className="prose prose-stone max-w-none text-xs text-stone-600 leading-relaxed space-y-4">
        <h3 className="text-sm font-bold text-textDark">1. Acceptance of Terms</h3>
        <p>
          By creating an account or accessing the Wedora platform, you agree to comply with and be bound by these Terms of Service.
        </p>

        <h3 className="text-sm font-bold text-textDark">2. Platform Usage & Calculations</h3>
        <p>
          Wedora provides budgeting, checklist, and guest management tools as planning aids. While our calculation engine adheres to strict mathematical accuracy, couples remain responsible for independent financial agreements, currency conversions, and vendor contracts.
        </p>

        <h3 className="text-sm font-bold text-textDark">3. Invitations & Guest Communications</h3>
        <p>
          Users are responsible for ensuring that communications sent to wedding guests comply with applicable anti-spam and privacy standards. Wedora provides WhatsApp share links and direct web forms for RSVP collection.
        </p>
      </Card>
    </div>
  );
}

