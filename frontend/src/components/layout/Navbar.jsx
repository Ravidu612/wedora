import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWedding } from '../../contexts/WeddingContext';
import Button from '../common/Button';
import { Heart, Menu, X, Sparkles, LayoutDashboard, LogOut } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { activeWedding } = useWedding();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-champagne-100/70 border border-champagne-300 flex items-center justify-center text-champagne-600 transition-transform group-hover:scale-105 shadow-sm">
            <Heart className="w-5 h-5 fill-champagne-500/20 text-champagne-600" />
          </div>
          <div>
            <span className="text-2xl font-serif font-bold tracking-tight text-textDark">
              Wedora
            </span>
            <span className="block text-[10px] tracking-widest uppercase text-champagne-600 font-semibold -mt-1">
              Smart Wedding System
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <Link to="/" className="hover:text-champagne-600 transition-colors">
            Home
          </Link>
          <Link to="/features" className="hover:text-champagne-600 transition-colors">
            Features
          </Link>
          <Link to="/how-it-works" className="hover:text-champagne-600 transition-colors">
            How It Works
          </Link>
          <Link to="/pricing" className="hover:text-champagne-600 transition-colors">
            Pricing
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <Button variant="primary" size="sm" icon={LayoutDashboard}>
                  Wedding Dashboard
                </Button>
              </Link>
              <button
                onClick={logout}
                title="Log out"
                className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" icon={Sparkles}>
                  Start Planning
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-stone-700 hover:bg-stone-50 rounded-lg"
          >
            Home
          </Link>
          <Link
            to="/features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-stone-700 hover:bg-stone-50 rounded-lg"
          >
            Features
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-stone-700 hover:bg-stone-50 rounded-lg"
          >
            How It Works
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-stone-700 hover:bg-stone-50 rounded-lg"
          >
            Pricing
          </Link>

          <div className="pt-4 border-t border-stone-100 space-y-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block">
                  <Button variant="primary" className="w-full" icon={LayoutDashboard}>
                    Open Wedding Dashboard
                  </Button>
                </Link>
                <Button variant="outline" className="w-full" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block">
                  <Button variant="primary" className="w-full">
                    Start Planning Your Wedding
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

