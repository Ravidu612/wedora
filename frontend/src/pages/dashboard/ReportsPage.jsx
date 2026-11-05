import React from 'react';
import { useWedding } from '../../contexts/WeddingContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  Users,
  DollarSign,
  Receipt,
  Store,
  CreditCard,
} from 'lucide-react';

export default function ReportsPage() {
  const { activeWeddingId, activeWedding } = useWedding();

  const handleDownloadBudgetPDF = () => {
    window.open(`/api/weddings/${activeWeddingId}/reports/budget-pdf`, '_blank');
  };

  const handleDownloadGuestsCSV = () => {
    window.open(`/api/weddings/${activeWeddingId}/reports/guests-csv`, '_blank');
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-champagne-600">
            Export Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-textDark tracking-tight mt-1">
            Wedding Reports & Documentation
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Generate executive PDF statements and CSV data exports for your records or loan applications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handlePrintSummary} variant="outline" size="sm" icon={Printer}>
            Print Page
          </Button>
          <Button onClick={handleDownloadBudgetPDF} variant="primary" size="sm" icon={Download}>
            Download PDF Report
          </Button>
        </div>
      </div>

      {/* Available Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-champagne-100 text-champagne-800 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-textDark">
              Executive Budget Statement (PDF)
            </h3>
            <p className="text-xs text-textMuted leading-relaxed">
              Official document formatted with wedding banner, total budget breakdown, bride vs groom allocations, and line-item actual spending.
            </p>
          </div>
          <div className="pt-6">
            <Button
              onClick={handleDownloadBudgetPDF}
              variant="primary"
              size="sm"
              className="w-full"
              icon={Download}
            >
              Export PDF Statement
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-textDark">
              Guest List & RSVPs (CSV)
            </h3>
            <p className="text-xs text-textMuted leading-relaxed">
              Full spreadsheet containing guest names, category, attendance headcount, confirmed status, dietary preferences, and table numbers.
            </p>
          </div>
          <div className="pt-6">
            <Button
              onClick={handleDownloadGuestsCSV}
              variant="secondary"
              size="sm"
              className="w-full"
              icon={Download}
            >
              Export CSV Spreadsheet
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-dustyRose-100 text-dustyRose-500 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-textDark">
              Vendor Contracts & Quotations
            </h3>
            <p className="text-xs text-textMuted leading-relaxed">
              Detailed list of vendor contacts, agreed contract amounts, advance deposits paid, and remaining balance deadlines.
            </p>
          </div>
          <div className="pt-6">
            <Button
              onClick={handleDownloadBudgetPDF}
              variant="outline"
              size="sm"
              className="w-full"
              icon={FileText}
            >
              Include in PDF Statement
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

