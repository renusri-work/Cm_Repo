import React, { useState } from 'react';
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Flame,
  Plus,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Booking, ClientProperty, Unit } from '../../types';
import { storage } from '../../services/storage';

interface CalendarPricingTabProps {
  client: ClientProperty;
  bookings: Booking[];
  onOpenBookingModal: (unit?: Unit, date?: string) => void;
  onRefresh: () => void;
  theme: 'dark' | 'light';
}

export const CalendarPricingTab: React.FC<CalendarPricingTabProps> = ({
  client,
  bookings,
  onOpenBookingModal,
  onRefresh,
  theme,
}) => {
  const isDark = theme === 'dark';
  const isHotel = client.type === 'hotel';

  // Dynamic pricing state
  const [weekendSurge, setWeekendSurge] = useState(client.dynamicPricing.weekendSurgePercent || 25);
  const [highDemandSurge, setHighDemandSurge] = useState(client.dynamicPricing.highDemandSurgePercent || 40);
  const [seasonFactor, setSeasonFactor] = useState(client.dynamicPricing.seasonFactorPercent || 20);
  const [isFestivalActive, setIsFestivalActive] = useState(true);
  const [syncingPrices, setSyncingPrices] = useState(false);
  const [priceSyncedMsg, setPriceSyncedMsg] = useState(false);

  // 14-day date range starting Nov 01, 2026
  const dates = Array.from({ length: 14 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-11-${String(dayNum).padStart(2, '0')}`;
    const d = new Date(2026, 10, dayNum); // Nov is month 10 (0-indexed)
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const isWeekend = dayName === 'Fri' || dayName === 'Sat' || dayName === 'Sun';
    return { dateStr, dayNum, dayName, isWeekend };
  });

  const getEffectivePrice = (unit: Unit, isWeekend: boolean, dateStr: string) => {
    if (client.dynamicPricing.manualDateOverrides[dateStr]) {
      return client.dynamicPricing.manualDateOverrides[dateStr];
    }
    let multiplier = 1.0;
    if (isWeekend) multiplier += weekendSurge / 100;
    if (isFestivalActive && (dateStr === '2026-11-06' || dateStr === '2026-11-07' || dateStr === '2026-11-08')) {
      multiplier += highDemandSurge / 100;
    }
    return Math.round(unit.basePrice * multiplier);
  };

  const getBookingForUnitAndDate = (unitId: string, dateStr: string) => {
    return bookings.find((b) => {
      return b.unitId === unitId && dateStr >= b.checkInDate && dateStr < b.checkOutDate;
    });
  };

  const handleSaveDynamicPricing = () => {
    setSyncingPrices(true);
    const updatedClient = {
      ...client,
      dynamicPricing: {
        ...client.dynamicPricing,
        weekendSurgePercent: weekendSurge,
        highDemandSurgePercent: highDemandSurge,
        seasonFactorPercent: seasonFactor,
      },
    };
    storage.updateClient(updatedClient);

    // Dispatch sync log for all OTAs
    const syncLogs = storage.getSyncLogs();
    syncLogs.unshift({
      id: `sync-${Date.now()}`,
      propertyId: client.id,
      channel: 'MakeMyTrip',
      action: 'price_synced',
      timestamp: new Date().toISOString().substring(0, 19).replace('T', ' '),
      status: 'synced',
      details: `ARI dynamic pricing updated across all ${client.units.length} units: Weekend surge (${weekendSurge}%), Festival surge (${highDemandSurge}%).`,
    });
    storage.saveSyncLogs(syncLogs);

    setTimeout(() => {
      setSyncingPrices(false);
      setPriceSyncedMsg(true);
      onRefresh();
      setTimeout(() => setPriceSyncedMsg(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded border border-orange-500/30">
              {isHotel ? 'Hotel Multi-Room Matrix' : 'Villa Availability Grid'}
            </span>
            <span className="text-xs text-gray-400">14-Day Live Horizon</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Availability Calendar & Dynamic Pricing Engine</h2>
          <p className="text-xs text-gray-400 mt-1">
            Visual room occupancy, automated weekend / festival demand multipliers, and live rate parity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenBookingModal()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/25"
          >
            <Plus className="w-4 h-4" />
            <span>Book Selected Date</span>
          </button>
        </div>
      </div>

      {/* Dynamic Pricing Engine Control Box */}
      <div className={`p-6 rounded-2xl border ${
        isDark ? 'bg-gradient-to-br from-[#12141F] to-[#0A0C11] border-orange-500/30' : 'bg-orange-50/50 border-orange-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Dynamic Pricing Algorithms & Surge Rules</h3>
              <p className="text-xs text-gray-400">Automatically adjust rates pushed to MakeMyTrip, Goibibo, and Direct engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {priceSyncedMsg && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1 animate-fade-in">
                <Check className="w-3.5 h-3.5" /> Pushed to OTAs
              </span>
            )}
            <button
              onClick={handleSaveDynamicPricing}
              disabled={syncingPrices}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/25 transition-all"
            >
              {syncingPrices ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Syncing OTA Extranets...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Apply & Push to OTAs</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Weekend Surge */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-200">Weekend Surge (Fri – Sun)</span>
              <span className="font-mono font-bold text-orange-400 text-sm">+{weekendSurge}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={60}
              step={5}
              value={weekendSurge}
              onChange={(e) => setWeekendSurge(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
            <p className="text-[11px] text-gray-400 mt-2">
              Automatically inflates Fri/Sat night rates to capture high leisure demand.
            </p>
          </div>

          {/* Festival Surge */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-200">Festival / Holiday Surge</span>
              <span className="font-mono font-bold text-amber-400 text-sm">+{highDemandSurge}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={highDemandSurge}
              onChange={(e) => setHighDemandSurge(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-gray-400">Nov 6-8 Special Surge</span>
              <button
                type="button"
                onClick={() => setIsFestivalActive(!isFestivalActive)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isFestivalActive ? 'bg-amber-500 text-white' : 'bg-white/10 text-gray-400'
                }`}
              >
                {isFestivalActive ? 'ACTIVE' : 'DISABLED'}
              </button>
            </div>
          </div>

          {/* Season Factor */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-200">Peak Winter Season Uplift</span>
              <span className="font-mono font-bold text-orange-400 text-sm">+{seasonFactor}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={5}
              value={seasonFactor}
              onChange={(e) => setSeasonFactor(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
            <p className="text-[11px] text-gray-400 mt-2">
              Applies winter destination baseline bump across all inventory.
            </p>
          </div>
        </div>
      </div>

      {/* 14-Day Calendar Matrix View */}
      <div className={`rounded-2xl border overflow-hidden ${
        isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-400" />
            <h3 className="font-bold text-sm">November 2026 Reservation Matrix</h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-gray-400 text-[11px]">
              <span className="w-2.5 h-2.5 rounded bg-orange-500/40 border border-orange-500" /> Booked / Occupied
            </span>
            <span className="flex items-center gap-1.5 text-gray-400 text-[11px]">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500/20 border border-emerald-500/40" /> Available (Click to Book)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs min-w-[900px]">
            <thead>
              <tr className={`border-b ${isDark ? 'bg-black/40 border-white/10 text-gray-400' : 'bg-slate-100 border-slate-200'}`}>
                <th className="p-3 w-44 sticky left-0 z-10 bg-inherit font-bold">
                  {isHotel ? 'Room / Unit' : 'Property / Villa'}
                </th>
                {dates.map((d) => (
                  <th
                    key={d.dateStr}
                    className={`p-2 text-center min-w-[65px] font-semibold border-l border-white/5 ${
                      d.isWeekend ? (isDark ? 'bg-orange-500/5 text-orange-400' : 'bg-orange-50 text-orange-600') : ''
                    }`}
                  >
                    <div className="text-[10px] text-gray-400">{d.dayName}</div>
                    <div className="font-bold text-xs">{d.dayNum}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {client.units?.map((unit) => (
                <tr key={unit.id} className="hover:bg-white/5 transition-colors">
                  <td className={`p-3 sticky left-0 z-10 font-bold ${
                    isDark ? 'bg-[#0E1017] text-white' : 'bg-white text-slate-900'
                  } border-r border-white/10`}>
                    <div className="text-xs">{unit.name}</div>
                    <div className="text-[10px] text-gray-400 truncate max-w-[150px]">{unit.category}</div>
                    <div className="text-[10px] text-orange-400 font-mono">Base: ₹{unit.basePrice}</div>
                  </td>

                  {dates.map((d) => {
                    const booking = getBookingForUnitAndDate(unit.id, d.dateStr);
                    const dynamicPrice = getEffectivePrice(unit, d.isWeekend, d.dateStr);

                    if (booking) {
                      const isCheckInDay = booking.checkInDate === d.dateStr;
                      return (
                        <td
                          key={d.dateStr}
                          className="p-1 border-l border-white/5 text-center bg-orange-500/15"
                          title={`${booking.guestName} (${booking.source.toUpperCase()})`}
                        >
                          <div className="p-1 rounded bg-orange-500/30 border border-orange-500/50 text-orange-200 text-[10px] font-bold truncate">
                            {isCheckInDay ? `Arrival: ${booking.guestName.split(' ')[0]}` : booking.guestName.split(' ')[0]}
                          </div>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={d.dateStr}
                        onClick={() => onOpenBookingModal(unit, d.dateStr)}
                        className={`p-1.5 border-l border-white/5 text-center cursor-pointer transition-all hover:bg-emerald-500/20 ${
                          d.isWeekend ? (isDark ? 'bg-orange-500/5' : 'bg-orange-50/50') : ''
                        }`}
                        title={`Click to book ${unit.name} on ${d.dateStr} at ₹${dynamicPrice}`}
                      >
                        <div className="text-[10px] text-gray-400 hover:text-emerald-400 font-mono">
                          ₹{Math.round(dynamicPrice / 1000)}k
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
