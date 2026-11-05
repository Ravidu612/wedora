import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useWedding } from '../../contexts/WeddingContext';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';
import { Upload, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export default function CSVImportModal({ isOpen, onClose, onSuccess }) {
  const { activeWeddingId } = useWedding();
  const { addToast } = useToast();

  const [csvText, setCsvText] = useState('');
  const [parsedGuests, setParsedGuests] = useState([]);
  const [loading, setLoading] = useState(false);

  const sampleCSV = `Name,Phone,Email,Category,Attendees,Dietary
Kasun Jayawardena,+94771234567,kasun@example.com,Bride Friends,2,Standard / Non-Veg
Nadeesha Fernando,+94719876543,nadeesha@example.com,Groom Family,1,Vegetarian
Ruwan & Family,+94751112233,ruwan@example.com,Relatives,4,Halal`;

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    if (lines.length <= 1) return [];

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const guests = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));

      const guest = {
        name: cols[0] || 'Guest',
        phone: cols[1] || '',
        email: cols[2] || '',
        category: cols[3] || 'Relatives',
        attendeesCount: Number(cols[4]) || 1,
        dietaryPreferences: cols[5] || 'Standard / Non-Veg',
      };
      guests.push(guest);
    }
    return guests;
  };

  const handleTextChange = (e) => {
    const txt = e.target.value;
    setCsvText(txt);
    const parsed = parseCSV(txt);
    setParsedGuests(parsed);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setCsvText(content);
      const parsed = parseCSV(content);
      setParsedGuests(parsed);
    };
    reader.readAsText(file);
  };

  const handleUploadSample = () => {
    setCsvText(sampleCSV);
    setParsedGuests(parseCSV(sampleCSV));
  };

  const handleBulkSubmit = async () => {
    if (parsedGuests.length === 0) {
      addToast('No valid guest rows detected.', 'warning');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(`/weddings/${activeWeddingId}/guests/bulk`, {
        guests: parsedGuests,
      });

      addToast(res.data.message || `Imported ${parsedGuests.length} guests!`, 'success');
      onSuccess();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to import guests.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Import Guests"
      subtitle="Upload or paste a CSV spreadsheet of your guest list"
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold uppercase tracking-wider text-stone-600">
            Paste CSV or Upload File
          </label>
          <button
            type="button"
            onClick={handleUploadSample}
            className="text-champagne-700 underline font-semibold hover:text-champagne-900"
          >
            Insert Sample Template
          </button>
        </div>

        <textarea
          rows={5}
          className="w-full font-mono text-xs p-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-champagne-500"
          placeholder="Name,Phone,Email,Category,Attendees,Dietary..."
          value={csvText}
          onChange={handleTextChange}
        />

        <div className="flex items-center gap-3">
          <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-ivory border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-100">
            <Upload className="w-4 h-4 text-champagne-600" />
            <span>Select CSV File</span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          {parsedGuests.length > 0 && (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {parsedGuests.length} guests parsed successfully
            </span>
          )}
        </div>

        {parsedGuests.length > 0 && (
          <div className="max-h-40 overflow-y-auto border border-stone-200 rounded-xl text-xs divide-y divide-stone-100">
            {parsedGuests.slice(0, 5).map((g, i) => (
              <div key={i} className="p-2.5 flex justify-between bg-white">
                <span className="font-semibold text-stone-800">{g.name}</span>
                <span className="text-stone-500">{g.category} • {g.attendeesCount} pax</span>
              </div>
            ))}
            {parsedGuests.length > 5 && (
              <div className="p-2 text-center text-stone-400 text-[11px] bg-stone-50">
                + {parsedGuests.length - 5} more guests
              </div>
            )}
          </div>
        )}

        <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={parsedGuests.length === 0}
            isLoading={loading}
            onClick={handleBulkSubmit}
          >
            Import {parsedGuests.length > 0 ? `${parsedGuests.length} Guests` : ''}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

