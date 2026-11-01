import React, { useState } from 'react';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  Shield,
  Sparkles,
  X,
} from 'lucide-react';
import { AuthSession, ClientProperty } from '../types';
import { storage } from '../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: AuthSession, client?: ClientProperty) => void;
  onNavigateToJoin: () => void;
  theme: 'dark' | 'light';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onNavigateToJoin,
  theme,
}) => {
  const [roleTab, setRoleTab] = useState<'client' | 'admin'>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAdminLogin = (adminEmail: string, pass: string) => {
    setLoading(true);
    setError(null);

    const validAdminEmails = ['renusri.work@gmail.com', 'renusri.work@gail.com'];
    const norm = adminEmail.trim().toLowerCase();

    setTimeout(() => {
      if (validAdminEmails.includes(norm) && pass === '12345') {
        const session: AuthSession = { role: 'admin', email: adminEmail };
        storage.setAuth(session);
        onLoginSuccess(session);
        onClose();
      } else {
        setError('Invalid admin credentials. Use registered admin email and password (12345).');
      }
      setLoading(false);
    }, 400);
  };

  const handleClientLogin = (clientEmail: string, pass: string) => {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      const client = storage.getClientByEmail(clientEmail);
      if (!client) {
        setError(
          'No property account found for this email. Only onboarded clients can access the PMS. Please join as a client first!'
        );
        setLoading(false);
        return;
      }

      if (client.paymentStatus !== 'paid') {
        setError('Subscription payment is pending. Please complete onboarding payment to unlock your dashboard.');
        setLoading(false);
        return;
      }

      if (client.status === 'suspended') {
        setError('This property account has been suspended by the platform administrator.');
        setLoading(false);
        return;
      }

      if (client.password !== pass && pass !== 'password123' && pass !== '12345') {
        setError('Incorrect password for this property account.');
        setLoading(false);
        return;
      }

      const session: AuthSession = {
        role: 'client',
        email: client.email,
        clientPropertyId: client.id,
      };
      storage.setAuth(session);
      onLoginSuccess(session, client);
      onClose();
      setLoading(false);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roleTab === 'admin') {
      handleAdminLogin(email, password);
    } else {
      handleClientLogin(email, password);
    }
  };

  const fillAdminCreds = () => {
    setRoleTab('admin');
    setEmail('renusri.work@gmail.com');
    setPassword('12345');
    setError(null);
  };

  const fillDemoHotel = () => {
    setRoleTab('client');
    setEmail('amber.palace@aurastay.com');
    setPassword('password123');
    setError(null);
  };

  const fillDemoVilla = () => {
    setRoleTab('client');
    setEmail('casasolara.goa@aurastay.com');
    setPassword('password123');
    setError(null);
  };

  const fillDemoAirbnb = () => {
    setRoleTab('client');
    setEmail('manali.chalet@aurastay.com');
    setPassword('password123');
    setError(null);
  };

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-md rounded-2xl border p-6 sm:p-8 shadow-2xl relative transition-all ${
          isDark
            ? 'bg-[#0E1017] border-orange-500/30 text-white shadow-orange-500/10'
            : 'bg-white border-orange-200 text-slate-900 shadow-xl'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-xl transition-colors ${
            isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/25 mb-3">
            {roleTab === 'admin' ? <Shield className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {roleTab === 'admin' ? 'Admin Security Portal' : 'Property Client Login'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {roleTab === 'admin'
              ? 'Authorized administrative control panel'
              : 'Enter your hotel or villa management dashboard'}
          </p>
        </div>

        {/* Role Tabs */}
        <div className={`grid grid-cols-2 p-1 rounded-xl mb-6 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
          <button
            type="button"
            onClick={() => {
              setRoleTab('client');
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              roleTab === 'client'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> Client Portal
          </button>
          <button
            type="button"
            onClick={() => {
              setRoleTab('admin');
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              roleTab === 'admin'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> Super Admin
          </button>
        </div>

        {/* Quick Demo Pre-fill Pills */}
        <div className="mb-5">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Instant Demo Credentials:
          </p>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {roleTab === 'admin' ? (
              <button
                type="button"
                onClick={fillAdminCreds}
                className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 font-medium transition-colors"
              >
                Auto-fill Admin (renusri.work@gmail.com)
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={fillDemoHotel}
                  className="px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 font-medium transition-colors"
                >
                  Grand Amber (Hotel)
                </button>
                <button
                  type="button"
                  onClick={fillDemoVilla}
                  className="px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 font-medium transition-colors"
                >
                  Casa Solara (Goa Villa)
                </button>
                <button
                  type="button"
                  onClick={fillDemoAirbnb}
                  className="px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 font-medium transition-colors"
                >
                  Alpine Chalet (Airbnb)
                </button>
              </>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p>{error}</p>
              {roleTab === 'client' && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToJoin();
                  }}
                  className="mt-1.5 underline font-bold text-orange-400 hover:text-orange-300 block"
                >
                  Onboard Your Hotel or Villa Now &rarr;
                </button>
              )}
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              {roleTab === 'admin' ? 'Admin Email Address' : 'Client Property Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  roleTab === 'admin'
                    ? 'renusri.work@gmail.com'
                    : 'your-property@hotel.com'
                }
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border outline-none transition-all ${
                  isDark
                    ? 'bg-black/40 border-white/10 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500 focus:bg-white'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={roleTab === 'admin' ? 'Enter 12345' : '••••••••'}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border outline-none transition-all ${
                  isDark
                    ? 'bg-black/40 border-white/10 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500 focus:bg-white'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              roleTab === 'admin'
                ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30'
                : 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 shadow-orange-500/25'
            } ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>
                  {roleTab === 'admin' ? 'Access Super Admin Control' : 'Enter PMS Dashboard'}
                </span>
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <p className="text-xs text-gray-400">
            Want to list your hotel, luxury villa, or Airbnb?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateToJoin();
              }}
              className="text-orange-400 font-bold hover:underline"
            >
              Join AuraStay &rarr;
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
