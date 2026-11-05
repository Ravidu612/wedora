import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { calculateWeddingFinancials } from '../utils/calculation';

const WeddingContext = createContext(null);

export function WeddingProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [weddings, setWeddings] = useState([]);
  const [activeWeddingId, setActiveWeddingId] = useState(() => localStorage.getItem('wedora_active_wedding_id'));
  const [activeWedding, setActiveWedding] = useState(null);
  const [weddingEvents, setWeddingEvents] = useState([]);
  const [weddingMembers, setWeddingMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [financials, setFinancials] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all weddings for user
  const fetchWeddings = useCallback(async () => {
    if (!isAuthenticated) {
      setWeddings([]);
      setActiveWedding(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get('/weddings');
      if (res.data.success) {
        const list = res.data.weddings || [];
        setWeddings(list);

        // Determine active wedding
        let currentId = activeWeddingId;
        if (!currentId || !list.some(w => w._id === currentId)) {
          if (list.length > 0) {
            currentId = list[0]._id;
            setActiveWeddingId(currentId);
            localStorage.setItem('wedora_active_wedding_id', currentId);
          } else {
            setActiveWedding(null);
            setActiveWeddingId(null);
            localStorage.removeItem('wedora_active_wedding_id');
          }
        }
      }
    } catch (err) {
      console.error('Failed to load weddings:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, activeWeddingId]);

  // Load detailed active wedding data
  const fetchActiveWeddingData = useCallback(async (weddingId) => {
    if (!weddingId || !isAuthenticated) return;

    try {
      const [wRes, expRes, payRes, contRes] = await Promise.all([
        api.get(`/weddings/${weddingId}`),
        api.get(`/weddings/${weddingId}/expenses`),
        api.get(`/weddings/${weddingId}/payments`),
        api.get(`/weddings/${weddingId}/contributions`),
      ]);

      if (wRes.data.success) {
        setActiveWedding(wRes.data.wedding);
        setWeddingEvents(wRes.data.events || []);
        setWeddingMembers(wRes.data.members || []);
      }

      const rawExpenses = expRes.data.expenses || [];
      const rawPayments = payRes.data.payments || [];
      const rawContributions = contRes.data.contributions || [];

      setExpenses(rawExpenses);
      setPayments(rawPayments);
      setContributions(rawContributions);

      // Run through centralized calculation engine
      const fin = calculateWeddingFinancials({
        totalBudget: wRes.data.wedding?.totalBudget || 0,
        expenses: rawExpenses,
        payments: rawPayments,
        contributions: rawContributions,
        weddingDate: wRes.data.wedding?.weddingDate,
      });

      setFinancials(fin);
    } catch (err) {
      console.error('Error fetching wedding data:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWeddings();
  }, [fetchWeddings]);

  useEffect(() => {
    if (activeWeddingId) {
      fetchActiveWeddingData(activeWeddingId);
    }
  }, [activeWeddingId, fetchActiveWeddingData]);

  const selectWedding = (id) => {
    setActiveWeddingId(id);
    localStorage.setItem('wedora_active_wedding_id', id);
  };

  const refreshActiveWedding = () => {
    if (activeWeddingId) {
      fetchActiveWeddingData(activeWeddingId);
    }
  };

  const updateActiveWedding = async (updates) => {
    if (!activeWeddingId) return;
    try {
      const res = await api.put(`/weddings/${activeWeddingId}`, updates);
      if (res.data.success) {
        setActiveWedding(res.data.wedding);
        addToast('Wedding details updated successfully.', 'success');
        refreshActiveWedding();
        return true;
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update wedding.', 'error');
      return false;
    }
  };

  return (
    <WeddingContext.Provider
      value={{
        weddings,
        activeWedding,
        activeWeddingId,
        weddingEvents,
        weddingMembers,
        expenses,
        payments,
        contributions,
        financials,
        loading,
        currency: activeWedding?.currency || 'LKR',
        selectWedding,
        fetchWeddings,
        refreshActiveWedding,
        updateActiveWedding,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
}

export const useWedding = () => {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
};

