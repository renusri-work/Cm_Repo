import React from 'react';
import {
  Building2,
  Calendar,
  Compass,
  Globe,
  LogIn,
  LogOut,
  Moon,
  Shield,
  Sparkles,
  Sun,
  UserCheck,
} from 'lucide-react';
import { AuthSession, ClientProperty } from '../types';

interface NavbarProps {
  currentView: 'landing' | 'admin' | 'client' | 'join';
  onNavigate: (view: 'landing' | 'admin' | 'client' | 'join') => void;
  authSession: AuthSession | null;
  activeClient: ClientProperty | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  authSession,
  activeClient,
  onOpenLogin,
  onLogout,
  theme,
  onToggleTheme,
}) => {
  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-[#090A0F]/90 border-orange-500/20 text-white'
          : 'bg-white/95 border-orange-200 text-slate-900 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 bg-clip-text text-transparent">
                AuraStay
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/30">
                Hospitality OS
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              Hotels, Airbnbs & Villas PMS • 2-Way OTA Sync
            </p>
          </div>
        </div>

        {/* Navigation Links for Public Landing */}
        {currentView === 'landing' && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a
              href="#features"
              className="text-gray-300 hover:text-orange-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#comparison"
              className="text-gray-300 hover:text-orange-400 transition-colors"
            >
              Hotels vs Villas
            </a>
            <a
              href="#channel-manager"
              className="text-gray-300 hover:text-orange-400 transition-colors"
            >
              OTA Sync
            </a>
            <a
              href="#pricing"
              className="text-gray-300 hover:text-orange-400 transition-colors"
            >
              Pricing
            </a>
            <button
              onClick={() => {
                const el = document.getElementById('join-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else onNavigate('join');
              }}
              className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> Join as Client
            </button>
          </nav>
        )}

        {/* Portal Breadcrumb / Indicator */}
        {currentView !== 'landing' && (
          <div className="flex items-center gap-2 text-xs font-medium">
            <button
              onClick={() => onNavigate('landing')}
              className="text-gray-400 hover:text-orange-400 transition-colors hidden sm:block"
            >
              Home
            </button>
            <span className="text-gray-600 hidden sm:block">/</span>
            {currentView === 'admin' && (
              <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/30 font-semibold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Super Admin Portal
              </span>
            )}
            {currentView === 'client' && activeClient && (
              <span className="px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/30 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {activeClient.name} ({activeClient.type.toUpperCase()})
              </span>
            )}
          </div>
        )}

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Theme switcher */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle dark/light mode"
            className={`p-2 rounded-xl border transition-all ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/30'
                : 'bg-slate-100 border-slate-200 text-orange-600 hover:bg-orange-50'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Auth State & Quick Action */}
          {authSession ? (
            <div className="flex items-center gap-2">
              {authSession.role === 'admin' ? (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 border transition-all ${
                    currentView === 'admin'
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                      : 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" /> Admin Dashboard
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('client')}
                  className={`text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 border transition-all ${
                    currentView === 'client'
                      ? 'bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-600/30'
                      : 'bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" /> Property Dashboard
                </button>
              )}

              <button
                onClick={onLogout}
                className="text-xs font-medium px-3 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 flex items-center gap-1 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLogin}
                className="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/15 flex items-center gap-1.5 transition-all"
              >
                <LogIn className="w-4 h-4 text-orange-400" />
                <span>Portal Login</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('join-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else onNavigate('join');
                }}
                className="text-xs sm:text-sm font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25 flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Join Now</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
