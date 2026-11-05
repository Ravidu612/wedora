import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useWedding } from '../../contexts/WeddingContext';
import { formatCurrency } from '../../utils/currency';
import { calculateCateringEstimate } from '../../utils/calculation';
import { Utensils, Calculator } from 'lucide-react';

export default function CateringCalculatorModal({ isOpen, onClose }) {
  const { currency, activeWedding } = useWedding();

  const [form, setForm] = useState({
    adultCount: activeWedding?.estimatedGuestCount ? Math.round(activeWedding.estimatedGuestCount * 0.9) : 180,
    childCount: activeWedding?.estimatedGuestCount ? Math.round(activeWedding.estimatedGuestCount * 0.1) : 20,
    adultPlateCost: 4500,
    childPlateCost: 2500,
    serviceChargePercent: 10,
    vatPercent: 0,
    additionalCharges: 50000, // corkage, welcome mocktails, dessert table
  });

  const estimate = calculateCateringEstimate(form);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Smart Catering & Plate Estimator"
      subtitle={`Calculate catering and food expenses accurately in ${currency}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Adult Guests Count"
            type="number"
            min={0}
            value={form.adultCount}
            onChange={(e) => setForm({ ...form, adultCount: Number(e.target.value) })}
          />
          <Input
            label={`Adult Plate Cost (${currency})`}
            type="number"
            min={0}
            value={form.adultPlateCost}
            onChange={(e) => setForm({ ...form, adultPlateCost: Number(e.target.value) })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Children Guests Count"
            type="number"
            min={0}
            value={form.childCount}
            onChange={(e) => setForm({ ...form, childCount: Number(e.target.value) })}
          />
          <Input
            label={`Child Plate Cost (${currency})`}
            type="number"
            min={0}
            value={form.childPlateCost}
            onChange={(e) => setForm({ ...form, childPlateCost: Number(e.target.value) })}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Service Charge (%)"
            type="number"
            min={0}
            value={form.serviceChargePercent}
            onChange={(e) => setForm({ ...form, serviceChargePercent: Number(e.target.value) })}
          />
          <Input
            label="Tax / VAT (%)"
            type="number"
            min={0}
            value={form.vatPercent}
            onChange={(e) => setForm({ ...form, vatPercent: Number(e.target.value) })}
          />
          <Input
            label={`Extras (${currency})`}
            type="number"
            min={0}
            helperText="Drinks / Corkage"
            value={form.additionalCharges}
            onChange={(e) => setForm({ ...form, additionalCharges: Number(e.target.value) })}
          />
        </div>

        {/* Breakdown Output Box */}
        <div className="bg-ivory rounded-2xl p-4 border border-champagne-300 space-y-2.5 text-xs">
          <div className="flex justify-between text-stone-600">
            <span>Adult Food Subtotal ({form.adultCount} pax × {formatCurrency(form.adultPlateCost, currency)}):</span>
            <span className="font-semibold text-stone-800">{formatCurrency(estimate.adultSubtotal, currency)}</span>
          </div>

          {estimate.childSubtotal > 0 && (
            <div className="flex justify-between text-stone-600">
              <span>Children Subtotal ({form.childCount} pax × {formatCurrency(form.childPlateCost, currency)}):</span>
              <span className="font-semibold text-stone-800">{formatCurrency(estimate.childSubtotal, currency)}</span>
            </div>
          )}

          <div className="flex justify-between text-stone-600">
            <span>Hotel Service Charge ({form.serviceChargePercent}%):</span>
            <span className="font-semibold text-stone-800">{formatCurrency(estimate.serviceCharge, currency)}</span>
          </div>

          {estimate.additionalCharges > 0 && (
            <div className="flex justify-between text-stone-600">
              <span>Additional Catering & Beverages:</span>
              <span className="font-semibold text-stone-800">{formatCurrency(estimate.additionalCharges, currency)}</span>
            </div>
          )}

          <div className="pt-2 border-t border-champagne-200/80 flex justify-between items-baseline text-sm font-bold text-stone-900">
            <span>Total Estimated Catering Cost:</span>
            <span className="text-base sm:text-lg text-champagne-800 font-serif">
              {formatCurrency(estimate.totalCost, currency)}
            </span>
          </div>

          <div className="text-right text-[11px] text-textMuted">
            Average per guest: <strong className="text-stone-700">{formatCurrency(estimate.averageCostPerGuest, currency)}</strong> (Total {estimate.totalGuests} guests)
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}

