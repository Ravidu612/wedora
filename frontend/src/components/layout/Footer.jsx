import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-champagne-500/20 border border-champagne-500/40 flex items-center justify-center text-champagne-400">
                <Heart className="w-4 h-4 fill-champagne-400/30 text-champagne-400" />
              </div>
              <span className="text-xl font-serif font-bold text-white tracking-tight">
                Wedora
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              The complete smart wedding planning and financial management system designed for modern couples and traditional Sri Lankan celebrations.
            </p>
            <div className="text-xs text-champagne-400 font-medium">
              Made with care for Sri Lankan & Global Weddings 🇱🇰
            </div>
          </div>

          {/* Planning links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Planning Tools
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><Link to="/features" className="hover:text-champagne-300 transition-colors">Budget & Expense Engine</Link></li>
              <li><Link to="/features" className="hover:text-champagne-300 transition-colors">Bride & Groom Side Splits</Link></li>
              <li><Link to="/features" className="hover:text-champagne-300 transition-colors">Digital Invitations & RSVP</Link></li>
              <li><Link to="/features" className="hover:text-champagne-300 transition-colors">Guest Seating Planner</Link></li>
              <li><Link to="/features" className="hover:text-champagne-300 transition-colors">Sri Lankan Wedding Checklist</Link></li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Wedora Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><Link to="/how-it-works" className="hover:text-champagne-300 transition-colors">How It Works</Link></li>
              <li><Link to="/pricing" className="hover:text-champagne-300 transition-colors">Pricing & Plans</Link></li>
              <li><Link to="/privacy" className="hover:text-champagne-300 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-champagne-300 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Sri Lankan Wedding Guide */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Traditions & Events
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              Full specialized support for Poruwa ceremonies, Kandyan & Western attire, Auspicious Nekath times, Homecoming celebrations, and multi-day festivities.
            </p>
            <div className="text-xs text-stone-500">
              Default currency: Sri Lankan Rupee (LKR)
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Wedora Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-stone-400 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-stone-400 transition-colors">Terms</Link>
            <span>v1.0.0 Production Release</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

