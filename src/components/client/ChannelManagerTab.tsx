import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRightLeft,
  CheckCircle2,
  Globe,
  Lock,
  Play,
  RefreshCw,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import { ClientProperty, OTASyncLog } from '../../types';
import { storage } from '../../services/storage';

interface ChannelManagerTabProps {
  client: ClientProperty;
  onRefresh: () => void;
  theme: 'dark' | 'light';
}

export const ChannelManagerTab: React.FC<ChannelManagerTabProps> = ({
  client,
  onRefresh,
  theme,
}) => {
  const isDark = theme === 'dark';

  const [syncedOTAs, setSyncedOTAs] = useState(client.syncedOTAs);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationToast, setSimulationToast] = useState<string | null>(null);
  const [logs, setLogs] = useState<OTASyncLog[]>(() =>
    storage.getSyncLogs().filter((l) => l.propertyId === client.id)
  );

  const toggleChannel = (channel: keyof typeof syncedOTAs) => {
    const updated = {
      ...syncedOTAs,
      [channel]: !syncedOTAs[channel],
    };
    setSyncedOTAs(updated);

    const updatedClient = {
      ...client,
      syncedOTAs: updated,
    };
    storage.updateClient(updatedClient);

    // Sync log
    const syncLogs = storage.getSyncLogs();
    syncLogs.unshift({
      id: `sync-${Date.now()}`,
      propertyId: client.id,
      channel: channel === 'makeMyTrip' ? 'MakeMyTrip' : channel === 'goibibo' ? 'Goibibo' : 'Airbnb',
      action: 'sync_verified',
      timestamp: new Date().toISOString().substring(0, 19).replace('T', ' '),
      status: 'synced',
      details: `${channel.toUpperCase()} channel connection toggled to ${updated[channel] ? 'ACTIVE' : 'PAUSED'}.`,
    });
    storage.saveSyncLogs(syncLogs);
    setLogs(syncLogs.filter((l) => l.propertyId === client.id));
    onRefresh();
  };

  const handleSimulateOTAIncoming = (channel: 'MakeMyTrip' | 'Goibibo' | 'Airbnb') => {
    setIsSimulating(true);
    setSimulationToast(null);

    setTimeout(() => {
      const newBooking = storage.simulateIncomingOTABooking(client.id, channel);
      setIsSimulating(false);

      if (newBooking) {
        setSimulationToast(
          `Incoming reservation ${newBooking.id} received from ${channel}! Room ${newBooking.unitName} occupied in real-time. Inventory blocked across all other channels.`
        );
        setLogs(storage.getSyncLogs().filter((l) => l.propertyId === client.id));
        onRefresh();
        setTimeout(() => setSimulationToast(null), 5000);
      } else {
        setSimulationToast(`All rooms currently occupied or property not available.`);
      }
    }, 900);
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
              Real-Time Channel Synchronizer
            </span>
            <span className="text-xs text-gray-400">Zero Overbooking Engine</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Two-Way OTA Synchronization Hub</h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time webhook pipelines connecting MakeMyTrip, Goibibo, Airbnb, and Booking.com with sub-second latency.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleSimulateOTAIncoming('MakeMyTrip')}
            disabled={isSimulating}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-600/25 transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Simulate MMT Booking</span>
          </button>

          <button
            onClick={() => handleSimulateOTAIncoming('Goibibo')}
            disabled={isSimulating}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/25 transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Goibibo Booking</span>
          </button>
        </div>
      </div>

      {/* Simulation Feedback Toast */}
      {simulationToast && (
        <div className="p-4 rounded-xl bg-orange-500/15 border border-orange-500/40 text-orange-300 text-xs flex items-center gap-3 animate-fade-in shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="font-semibold">{simulationToast}</p>
        </div>
      )}

      {/* Channel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            key: 'makeMyTrip' as const,
            name: 'MakeMyTrip (MMT)',
            desc: 'India’s largest OTA platform. Two-way inventory lock & ARI rate parity.',
            color: 'from-red-500 to-rose-600',
            latency: '110ms',
            badge: 'Direct Extranet API',
          },
          {
            key: 'goibibo' as const,
            name: 'Goibibo',
            desc: 'High-conversion booking engine. Instant room block upon offline walk-in.',
            color: 'from-orange-500 to-amber-600',
            latency: '135ms',
            badge: 'Instant Webhook V2',
          },
          {
            key: 'airbnb' as const,
            name: 'Airbnb & Villas',
            desc: 'Ideal for entire villas, homestays, and chalets. Automatic iCal & API sync.',
            color: 'from-pink-500 to-rose-500',
            latency: '160ms',
            badge: 'Host Partner Channel',
          },
          {
            key: 'bookingCom' as const,
            name: 'Booking.com',
            desc: 'Global inbound travelers. Automated credit card verification & rate sync.',
            color: 'from-blue-600 to-indigo-700',
            latency: '185ms',
            badge: 'Connectivity Partner',
          },
          {
            key: 'agoda' as const,
            name: 'Agoda YCS',
            desc: 'Southeast Asia and international distribution with automated stop-sells.',
            color: 'from-emerald-600 to-teal-700',
            latency: '210ms',
            badge: 'YCS Extranet API',
          },
        ].map((channel) => {
          const isActive = syncedOTAs[channel.key];
          return (
            <div
              key={channel.key}
              className={`p-6 rounded-2xl border transition-all ${
                isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${channel.color} text-white font-bold flex items-center justify-center text-sm shadow-md`}>
                  {channel.name.slice(0, 2).toUpperCase()}
                </div>

                {/* Connection switch */}
                <button
                  type="button"
                  onClick={() => toggleChannel(channel.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isActive ? 'bg-orange-500' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-base text-white">{channel.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'
                }`}>
                  {isActive ? 'LIVE 2-WAY' : 'DISCONNECTED'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-4">{channel.desc}</p>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                <span>Latency: <strong className="text-emerald-400">{channel.latency}</strong></span>
                <span className="text-gray-300">{channel.badge}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time Overbooking Prevention Telemetry Log */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-orange-400 animate-spin" style={{ animationDuration: '8s' }} />
            <h3 className="text-base font-bold">Live Channel Inventory Lock Audit</h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            AUTO-SYNC DISPATCHER: ACTIVE
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-400 bg-white/5 rounded-xl">
            No synchronization events yet. Offline bookings and simulated OTA bookings will stream live here.
          </div>
        ) : (
          <div className="space-y-2.5">
            {logs.slice(0, 8).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.channel === 'MakeMyTrip'
                      ? 'bg-red-500/20 text-red-300'
                      : log.channel === 'Goibibo'
                      ? 'bg-orange-500/20 text-orange-300'
                      : 'bg-pink-500/20 text-pink-300'
                  }`}>
                    {log.channel}
                  </span>
                  <span className="font-semibold text-gray-200">{log.action.replace('_', ' ').toUpperCase()}</span>
                  <span className="text-gray-400 hidden sm:inline">•</span>
                  <span className="text-gray-300">{log.details}</span>
                </div>
                <div className="text-[11px] text-gray-400 font-mono shrink-0">
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
