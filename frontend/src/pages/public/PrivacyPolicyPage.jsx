import React from 'react';
import Card from '../../components/common/Card';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-serif font-bold text-textDark">Privacy Policy</h1>
        <p className="text-xs text-textMuted">Last updated: November 2026</p>
      </div>

      <Card className="prose prose-stone max-w-none text-xs text-stone-600 leading-relaxed space-y-4">
        <h3 className="text-sm font-bold text-textDark">1. Information We Collect</h3>
        <p>
          Wedora collects information provided directly by wedding organizers, including names, wedding dates, guest contact details, expense records, and vendor quotation details. All information remains confidential to your authorized wedding workspace.
        </p>

        <h3 className="text-sm font-bold text-textDark">2. How We Protect Your Wedding Data</h3>
        <p>
          We employ industry-standard encryption, token-based authentication (JWT), secure password hashing (bcrypt), and granular workspace permission barriers ensuring that no unauthorized third party can view your guest lists or financial spending.
        </p>

        <h3 className="text-sm font-bold text-textDark">3. Public Digital Invitations</h3>
        <p>
          When you enable a digital invitation, only public wedding details (Bride & Groom names, celebration date, approved ceremony schedule, and venue) are visible on your custom URL. Sensitive financial records, private notes, and internal calculations are strictly excluded from public invitation endpoints.
        </p>

        <h3 className="text-sm font-bold text-textDark">4. Data Ownership</h3>
        <p>
          You retain complete ownership over all data entered into Wedora. You may export your financial reports and guest rosters at any time or delete your wedding workspace completely.
        </p>
      </Card>
    </div>
  );
}

