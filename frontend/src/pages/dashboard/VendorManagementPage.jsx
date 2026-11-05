import React, { useState, useEffect } from 'react';
import { useWedding } from '../../contexts/WeddingContext';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import VendorModal from '../../components/vendors/VendorModal';
import api from '../../services/api';
import {
  Store,
  Plus,
  Phone,
  Mail,
  DollarSign,
  CreditCard,
  Edit,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

export default function VendorManagementPage() {
  const { activeWeddingId, currency } = useWedding();
  const { addToast } = useToast();

  const [vendors, setVendors] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  const fetchVendors = async () => {
    if (!activeWeddingId) return;
    try {
      setLoading(true);
      const res = await api.get(`/weddings/${activeWeddingId}/vendors`);
      if (res.data.success) {
        setVendors(res.data.vendors || []);
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [activeWeddingId]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete vendor "${name}"?`)) return;
    try {
      await api.delete(`/weddings/${activeWeddingId}/vendors/${id}`);
      addToast('Vendor removed.', 'info');
      fetchVendors();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to remove vendor.', 'error');
    }
  };

  const filteredVendors = vendors.filter((v) => {
    const matchCat = categoryFilter === 'All' || v.category === categoryFilter;
    const matchStatus = statusFilter === 'All' || v.bookingStatus === statusFilter;
    return matchCat && matchStatus;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-champagne-600">
            Partner Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-textDark tracking-tight mt-1">
            Vendor Directory & Contracts
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Compare quotations, record contracts, and track advance deposits in {currency}.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingVendor(null);
            setVendorModalOpen(true);
          }}
          variant="primary"
          size="sm"
          icon={Plus}
        >
          Add Vendor
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Quoted Value"
          value={formatCurrency(summary?.totalQuoted || 0, currency)}
          subtext="Sum of vendor proposals"
          icon={Store}
        />
        <StatCard
          title="Contracted Commitments"
          value={formatCurrency(summary?.totalContracted || 0, currency)}
          subtext="Booked agreements"
          icon={CheckCircle2}
        />
        <StatCard
          title="Advance Deposits Paid"
          value={formatCurrency(summary?.totalAdvancePaid || 0, currency)}
          badgeText="Paid"
          badgeType="success"
          subtext="Verified advances"
          icon={CreditCard}
        />
        <StatCard
          title="Remaining Balance Due"
          value={formatCurrency(summary?.totalRemaining || 0, currency)}
          badgeText={summary?.totalRemaining > 0 ? 'Pending' : 'Settled'}
          badgeType={summary?.totalRemaining > 0 ? 'warning' : 'success'}
          subtext="Contract balance to settle"
          icon={DollarSign}
        />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Vendor Categories' },
              'Hotels & Reception Halls',
              'Photography',
              'Videography',
              'Bridal Dressing & Salon',
              'Groom Dressing',
              'Catering',
              'Decorations & Florists',
              'Poruwa & Cultural Items',
              'Cake Suppliers',
              'Music, DJ & Band',
              'Wedding Planners',
              'Transport & Vehicles',
              'Jewellery Shops',
              'Invitations & Stationery',
              'Other',
            ]}
          />

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Booking Statuses' },
              'Not Contacted',
              'Contacted',
              'Quotation Received',
              'Negotiating',
              'Booked',
              'Cancelled',
            ]}
          />
        </div>
      </Card>

      {/* Vendors Table */}
      {filteredVendors.length > 0 ? (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-ivory/80 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                  <th className="py-3 px-4">Vendor Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Booking Status</th>
                  <th className="py-3 px-4">Quoted</th>
                  <th className="py-3 px-4">Contract</th>
                  <th className="py-3 px-4">Advance Paid</th>
                  <th className="py-3 px-4">Balance</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredVendors.map((v) => {
                  const contract = v.contractAmount || v.quotedAmount || 0;
                  const balance = Math.max(0, contract - (v.advancePaid || 0));

                  return (
                    <tr key={v._id} className="hover:bg-stone-50/50">
                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        {v.name}
                        {v.contactPerson && (
                          <div className="text-[10px] text-stone-400 font-normal">Contact: {v.contactPerson}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">{v.category}</td>
                      <td className="py-3.5 px-4 text-stone-600">
                        <div>{v.phone || '-'}</div>
                        <div className="text-[10px] text-stone-400">{v.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            v.bookingStatus === 'Booked'
                              ? 'confirmed'
                              : v.bookingStatus === 'Quotation Received'
                              ? 'pending'
                              : 'default'
                          }
                          size="sm"
                        >
                          {v.bookingStatus}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-stone-700 font-medium">{formatCurrency(v.quotedAmount || 0, currency)}</td>
                      <td className="py-3.5 px-4 font-bold text-stone-900">{formatCurrency(v.contractAmount || 0, currency)}</td>
                      <td className="py-3.5 px-4 font-semibold text-emerald-700">{formatCurrency(v.advancePaid || 0, currency)}</td>
                      <td className="py-3.5 px-4 text-stone-800 font-bold">{formatCurrency(balance, currency)}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingVendor(v);
                              setVendorModalOpen(true);
                            }}
                            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(v._id, v.name)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <EmptyState
          icon={Store}
          title="No Vendors in this List"
          description="Keep track of photographers, halls, florists, hair dressers, and caterers."
          actionText="Add First Vendor"
          onAction={() => {
            setEditingVendor(null);
            setVendorModalOpen(true);
          }}
          actionIcon={Plus}
        />
      )}

      <VendorModal
        isOpen={vendorModalOpen}
        onClose={() => setVendorModalOpen(false)}
        vendor={editingVendor}
        onSuccess={fetchVendors}
      />
    </div>
  );
}

