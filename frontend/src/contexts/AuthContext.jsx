import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('wedora_token'));
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('wedora_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch {
          localStorage.removeItem('wedora_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('wedora_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        addToast(`Welcome back, ${res.data.user.name}!`, 'success');
        return { success: true, currentWeddingId: res.data.currentWeddingId };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      addToast(message, 'error');
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        localStorage.setItem('wedora_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        addToast('Registration successful! Welcome to Wedora.', 'success');
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      addToast(message, 'error');
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('wedora_token');
    localStorage.removeItem('wedora_active_wedding_id');
    setToken(null);
    setUser(null);
    addToast('You have been logged out.', 'info');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

