import React, { useState } from 'react';
import {
  BarChart3,
  Building2,
  Calendar,
  ChevronDown,
  DollarSign,
  FileSpreadsheet,
  FileText,
  Flame,
  Globe,
  Home,
  Hotel,
  Layers,
  LogOut,
  Menu,
  Moon,
  Plus,
  Receipt,
  RefreshCw,
  Settings,
  Shield,
  Sparkles,
  Sun,
  Users,
  UtensilsCrossed,
  X,
  Zap,
} from 'lucide-react';
import { Booking, ClientProperty, Unit } from '../../types';
import { storage } from '../../services/storage';
import { OverviewTab } from './OverviewTab';
import { CalendarPricingTab } from './CalendarPricingTab';
import { OfflineBookingTab } from './OfflineBookingTab';
import { ChannelManagerTab } from './ChannelManagerTab';
import { GSTFilingTab } from './GSTFilingTab';
import { QuotationReceiptModal } from './QuotationReceiptModal';

interface ClientDashboardProps {
  client: ClientProperty;
  onLogout: () => void;
  onSwitchProperty: (client: ClientProperty) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  client: initialClient,
  onLogout,
  onSwitchProperty,
  theme,
  onToggleTheme,
}) => {
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'booking' | 'channels' | 'gst'>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live state
  const [client, setClient] = useState<ClientProperty>(initialClient);
  const [bookings, setBookings] = useState<Booking[]>(() =>
    storage.getPropertyBookings(initialClient.id)
  );

  // Property Switcher dropdown
  const [showPropertyMenu, setShowPropertyMenu] = useState(false);
  const allClients = storage.getClients();

  // Quotation & Receipt Modal State
  const [activeReceiptBooking, setActiveReceiptBooking] = useState<Booking | null>(null);
  const [receiptMode, setReceiptMode] = useState<'quotation' | 'receipt'>('receipt');
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Pre-selection for new booking
  const [preselectedUnit, setPreselectedUnit] = useState<Unit | undefined>(undefined);
  const [preselectedDate, setPreselectedDate] = useState<string | undefined>(undefined);

  const refreshData = () => {
    const updated = storage.getClientById(client.id);
    if (updated) setClient(updated);
    setBookings(storage.getPropertyBookings(client.id));
  };

  const handleOpenReceipt = (booking: Booking, mode: 'quotation' | 'receipt' = 'receipt') => {
    setActiveReceiptBooking(booking);
    setReceiptMode(mode);
    setShowReceiptModal(true);
  };

  const handleOpenBookingModal = (unit?: Unit, date?: string) => {
    setPreselectedUnit(unit);
    setPreselectedDate(date);
    setActiveTab('booking');
  };

  const handleSelectDifferentProperty = (newProp: ClientProperty) => {
    setShowPropertyMenu(false);
    setClient(newProp);
    setBookings(storage.getPropertyBookings(newProp.id));
    onSwitchProperty(newProp);
  };

  const isHotel = client.type === 'hotel';

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${
      isDark ? 'bg-[#090A0F] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Mobile Header Bar */}
      <div className={`md:hidden p-4 border-b flex items-center justify-between ${
        isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
            {client.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-xs truncate max-w-[180px]">{client.name}</div>
            <div className="text-[10px] text-orange-400 uppercase font-semibold">{client.type} PMS</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg border border-white/10 text-orange-400"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg border border-white/10 text-gray-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`w-full md:w-64 shrink-0 border-r flex flex-col justify-between transition-all ${
          mobileMenuOpen ? 'block' : 'hidden md:flex'
        } ${
          isDark
            ? 'bg-[#0C0E14] border-white/10 text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        <div>
          {/* Property Identity Card & Switcher */}
          <div className="p-4 border-b border-white/10 relative">
            <div
              onClick={() => setShowPropertyMenu(!showPropertyMenu)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                isDark
                  ? 'bg-white/5 border-orange-500/30 hover:border-orange-500/60'
                  : 'bg-slate-50 border-orange-200 hover:border-orange-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md ${
                    isHotel ? 'bg-gradient-to-tr from-orange-600 to-amber-500' : 'bg-gradient-to-tr from-amber-600 to-orange-400'
                  }`}>
                    {isHotel ? <Hotel className="w-4 h-4" /> : <Home className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-white truncate max-w-[130px]">
                      {client.name}
                    </div>
                    <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block">
                      {client.type} • {client.city}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Property Quick Switcher Dropdown (for testing different properties) */}
            {showPropertyMenu && (
              <div className={`absolute top-full left-4 right-4 mt-2 p-2 rounded-xl border shadow-2xl z-30 ${
                isDark ? 'bg-[#12141F] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                  Switch Active Property (Demo):
                </div>
                <div className="space-y-1">
                  {allClients.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectDifferentProperty(c)}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        c.id === client.id
                          ? 'bg-orange-500/20 text-orange-400 font-bold'
                          : 'hover:bg-white/5 text-gray-300'
                      }`}
                    >
                      <span className="truncate">{c.name}</span>
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5">
                        {c.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1.5 text-xs font-semibold">
            {[
              {
                id: 'overview' as const,
                label: 'Dashboard Overview',
                icon: BarChart3,
                badge: 'Live',
              },
              {
                id: 'calendar' as const,
                label: 'Availability & Dynamic Rates',
                icon: Calendar,
                badge: isHotel ? 'Rooms' : 'Villa',
              },
              {
                id: 'booking' as const,
                label: 'Offline Booking & Folios',
                icon: Receipt,
                badge: `${bookings.length}`,
              },
              {
                id: 'channels' as const,
                label: 'OTA Channel Manager',
                icon: Globe,
                badge: '2-Way Sync',
              },
              {
                id: 'gst' as const,
                label: 'GST Filing & Accounting',
                icon: FileSpreadsheet,
                badge: '12%/18%',
              },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 font-bold'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${
                        isActive
                          ? 'bg-black/20 text-white'
                          : 'bg-white/5 text-gray-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-3">
          {/* OTA Sync Heartbeat */}
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-semibold text-emerald-400">MakeMyTrip & Goibibo</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-300 font-bold">SYNCED</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                isDark ? 'border-white/10 text-gray-300 hover:text-white' : 'border-slate-200 text-slate-700'
              }`}
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-orange-400" /> : <Moon className="w-3.5 h-3.5 text-orange-500" />}
              <span className="text-[11px]">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs flex items-center gap-1 transition-colors"
              title="Logout from PMS"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="text-[11px]">Exit</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'overview' && (
          <OverviewTab
            client={client}
            bookings={bookings}
            onOpenBookingModal={handleOpenBookingModal}
            onOpenReceipt={handleOpenReceipt}
            onNavigateTab={(tab) => setActiveTab(tab as any)}
            theme={theme}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarPricingTab
            client={client}
            bookings={bookings}
            onOpenBookingModal={handleOpenBookingModal}
            onRefresh={refreshData}
            theme={theme}
          />
        )}

        {activeTab === 'booking' && (
          <OfflineBookingTab
            client={client}
            bookings={bookings}
            onRefresh={refreshData}
            onOpenReceiptModal={handleOpenReceipt}
            preselectedUnit={preselectedUnit}
            preselectedDate={preselectedDate}
            theme={theme}
          />
        )}

        {activeTab === 'channels' && (
          <ChannelManagerTab
            client={client}
            onRefresh={refreshData}
            theme={theme}
          />
        )}

        {activeTab === 'gst' && (
          <GSTFilingTab
            client={client}
            theme={theme}
          />
        )}
      </main>

      {/* QUOTATION & OFFICIAL RECEIPT MODAL */}
      {showReceiptModal && activeReceiptBooking && (
        <QuotationReceiptModal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          booking={activeReceiptBooking}
          client={client}
          initialMode={receiptMode}
          theme={theme}
        />
      )}
    </div>
  );
};
