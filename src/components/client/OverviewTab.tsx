import React from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Bed,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  CreditCard,
  DollarSign,
  FileText,
  Flame,
  Home,
  Hotel,
  Layers,
  MapPin,
  Moon,
  Plus,
  Receipt,
  Sparkles,
  TrendingUp,
  User,
  Users,
  UtensilsCrossed,
} from 'lucide-react';
import { Booking, ClientProperty, Unit } from '../../types';

interface OverviewTabProps {
  client: ClientProperty;
  bookings: Booking[];
  onOpenBookingModal: (unit?: Unit) => void;
  onOpenReceipt: (booking: Booking, mode?: 'quotation' | 'receipt') => void;
  onNavigateTab: (tab: string) => void;
  theme: 'dark' | 'light';
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  client,
  bookings,
  onOpenBookingModal,
  onOpenReceipt,
  onNavigateTab,
  theme,
}) => {
  const isDark = theme === 'dark';
  const isHotel = client.type === 'hotel';

  // Current stays (today is 2026-11-01)
  const today = '2026-11-01';
  const activeStays = bookings.filter((b) => b.status === 'checked_in');

  // Next 2 days arrivals (2026-11-02 and 2026-11-03)
  const nextTwoDaysBookings = bookings.filter((b) => {
    return b.checkInDate === '2026-11-02' || b.checkInDate === '2026-11-03';
  });

  // Calculate stats
  const totalUnits = client.units?.length || 1;
  const occupiedUnits = client.units?.filter((u) => u.currentStatus === 'occupied').length || activeStays.length;
  const occupancyPercent = Math.min(100, Math.round((occupiedUnits / totalUnits) * 100));

  // Revenue analytics
  const todayRevenue = activeStays.reduce((acc, b) => acc + (b.taxBreakdown.grandTotal / b.numberOfNights), 0);
  const totalPaidRevenue = bookings
    .filter((b) => b.paymentStatus === 'paid')
    .reduce((acc, b) => acc + b.taxBreakdown.grandTotal, 0);

  // Channels count
  const channelCounts = bookings.reduce((acc: Record<string, number>, b) => {
    const src = b.source === 'makemytrip' ? 'MakeMyTrip' : b.source === 'goibibo' ? 'Goibibo' : b.source === 'airbnb' ? 'Airbnb' : 'Offline Direct';
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Property Header Banner */}
      <div className={`p-6 sm:p-8 rounded-2xl border relative overflow-hidden ${
        isDark
          ? 'bg-gradient-to-r from-[#12141F] via-[#1A1D2B] to-[#12141F] border-orange-500/30'
          : 'bg-gradient-to-r from-orange-50 via-white to-amber-50 border-orange-200 shadow-sm'
      }`}>
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                isHotel
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}>
                {client.type.toUpperCase()} PROPERTY MODE
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-400" /> {client.city}, {client.state}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{client.name}</h1>
            <p className="text-xs text-gray-400 mt-1 max-w-xl">
              Real-time Front Desk Operations, Live Channel Inventory Locks, and Automated Tax Invoicing
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenBookingModal()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Walk-in / Phone Booking</span>
            </button>

            <button
              onClick={() => onNavigateTab('channels')}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                isDark
                  ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                  : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>OTA 2-Way Sync</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Occupancy & Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupancy Rate */}
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Current Occupancy</span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <Bed className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-white">{occupancyPercent}%</span>
            <span className="text-xs text-orange-400 font-bold">
              ({occupiedUnits}/{totalUnits} {isHotel ? 'Rooms' : 'Units'} Occupied)
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
        </div>

        {/* Active Stays */}
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Current Active Stays</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">{activeStays.length} Stays</div>
          <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Checked-in with ID Verification
          </p>
        </div>

        {/* 2-Day Arrivals Forecast */}
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Next 2 Days Arrivals</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">{nextTwoDaysBookings.length} Guests</div>
          <p className="text-xs text-purple-400 font-medium mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Arriving Nov 02 – Nov 03
          </p>
        </div>

        {/* Total Month Revenue */}
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Settled Revenue (MTD)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">
            ₹{totalPaidRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-gray-400 mt-1">Rooms + F&B + Laundry Inclusive</p>
        </div>
      </div>

      {/* SECTION 1: Current Number of Stays (Real-time details) */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Stays In-House ({activeStays.length} Occupied {isHotel ? 'Rooms' : 'Villas'})</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Live guest roster, room allocation, add-on folios, and instant tax receipt generation
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('booking')}
            className="text-xs font-bold text-orange-400 hover:text-orange-300 underline"
          >
            Manage All Bookings &rarr;
          </button>
        </div>

        {activeStays.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-xs">
            No guests currently checked in. Use the button above to register an offline walk-in!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeStays.map((booking) => (
              <div
                key={booking.id}
                className={`p-4 rounded-xl border transition-all ${
                  isDark
                    ? 'bg-black/40 border-white/10 hover:border-orange-500/40'
                    : 'bg-slate-50 border-slate-200 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded border border-orange-500/20">
                    {booking.unitName}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                    {booking.source.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>{booking.guestName}</span>
                  </div>
                  <div className="text-[11px] text-gray-400">
                    {booking.guestPhone} • {booking.guestsCount.adults} Adults
                  </div>
                  <div className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-orange-400" />
                    <span>
                      {booking.checkInDate} &rarr; {booking.checkOutDate} ({booking.numberOfNights} Nights)
                    </span>
                  </div>
                </div>

                {/* Add-ons tag */}
                {booking.addonCharges.length > 0 && (
                  <div className="mb-3 pt-2 border-t border-white/5 flex flex-wrap gap-1 text-[10px]">
                    {booking.addonCharges.map((ad) => (
                      <span
                        key={ad.id}
                        className="px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10"
                      >
                        {ad.name} (₹{ad.quantity * ad.unitPrice})
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Total Folio</span>
                    <span className="text-sm font-black text-white">
                      ₹{booking.taxBreakdown.grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenReceipt(booking, 'receipt')}
                      className="px-2.5 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold flex items-center gap-1"
                      title="View & Download Official Receipt"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Receipt</span>
                    </button>
                    <button
                      onClick={() => onOpenReceipt(booking, 'quotation')}
                      className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium"
                      title="View Pro-Forma Quotation"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: Bookings for Next 2 Days & Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next 2 Days Arrivals Card */}
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-400" />
                <span>Upcoming Arrivals in Next 2 Days (Nov 02 & Nov 03)</span>
              </h3>
              <p className="text-xs text-gray-400">
                Confirmed reservations via MakeMyTrip, Goibibo, and Direct channels
              </p>
            </div>
            <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
              {nextTwoDaysBookings.length} Expected
            </span>
          </div>

          {nextTwoDaysBookings.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400 bg-white/5 rounded-xl">
              No new arrivals scheduled for the next 48 hours.
            </div>
          ) : (
            <div className="space-y-3">
              {nextTwoDaysBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{b.guestName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.source === 'makemytrip'
                          ? 'bg-red-500/20 text-red-300'
                          : b.source === 'goibibo'
                          ? 'bg-orange-500/20 text-orange-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {b.source.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-gray-400 text-[11px] mt-0.5">
                      Allocated: <strong className="text-orange-400">{b.unitName}</strong> • {b.numberOfNights} Nights ({b.checkInDate})
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-white text-sm">
                      ₹{b.taxBreakdown.grandTotal.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => onOpenReceipt(b, 'receipt')}
                      className="block text-[11px] text-orange-400 hover:underline mt-0.5 font-semibold"
                    >
                      Print Folio &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Channel Distribution & Operational Status */}
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <h3 className="text-base font-bold mb-1">Booking Channel Distribution</h3>
          <p className="text-xs text-gray-400 mb-4">Real-time sync share across online platforms & direct offline bookings</p>

          <div className="space-y-3 text-xs">
            {Object.entries(channelCounts).map(([channel, count]) => {
              const total = bookings.length || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={channel}>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-gray-300">{channel}</span>
                    <span className="text-orange-400">{count} bookings ({pct}%)</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-orange-500 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-gray-400">OTA Rate Parity Status:</span>
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
              100% SYNCHRONIZED
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: Live Inventory Key Grid */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold">
              {isHotel ? 'Hotel Rooms & Floor Matrix' : 'Villa / Airbnb Estate Units'}
            </h3>
            <p className="text-xs text-gray-400">Click any available room to initiate instant front-desk walk-in</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Available
            </span>
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <span className="w-2.5 h-2.5 rounded bg-orange-500" /> Occupied
            </span>
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <span className="w-2.5 h-2.5 rounded bg-purple-500" /> Reserved (OTA)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {client.units?.map((unit) => {
            const isOcc = unit.currentStatus === 'occupied';
            const isRes = unit.currentStatus === 'reserved';
            const isAvail = unit.currentStatus === 'available';

            return (
              <div
                key={unit.id}
                onClick={() => {
                  if (isAvail) onOpenBookingModal(unit);
                }}
                className={`p-3.5 rounded-xl border text-center transition-all ${
                  isAvail ? 'cursor-pointer hover:scale-105' : ''
                } ${
                  isOcc
                    ? 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                    : isRes
                    ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                }`}
              >
                <div className="text-sm font-black">{unit.name}</div>
                <div className="text-[10px] text-gray-400 truncate mt-0.5">{unit.category}</div>
                <div className="text-[11px] font-bold mt-1 text-white">
                  ₹{unit.basePrice.toLocaleString('en-IN')}
                </div>
                <div className="text-[9px] font-mono uppercase font-black mt-2 tracking-wider">
                  {unit.currentStatus}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
