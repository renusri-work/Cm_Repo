import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowUpDown,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Eye,
  Filter,
  Globe,
  Home,
  Hotel,
  Layers,
  LogOut,
  MoreVertical,
  Plus,
  Power,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { ClientProperty, ClientStatus, PlanType, PropertyType } from '../../types';
import { storage } from '../../services/storage';

interface AdminDashboardProps {
  onSelectClientPMS: (client: ClientProperty) => void;
  onLogout: () => void;
  theme: 'dark' | 'light';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSelectClientPMS,
  onLogout,
  theme,
}) => {
  const isDark = theme === 'dark';

  const [clients, setClients] = useState<ClientProperty[]>(() => storage.getClients());
  const [syncLogs, setSyncLogs] = useState(() => storage.getSyncLogs());

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | PropertyType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ClientStatus>('all');
  const [planFilter, setPlanFilter] = useState<'all' | PlanType>('all');

  // Selected client for detail view modal
  const [selectedClientDetail, setSelectedClientDetail] = useState<ClientProperty | null>(null);

  // Quick provision modal
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [newPropName, setNewPropName] = useState('');
  const [newPropType, setNewPropType] = useState<PropertyType>('hotel');
  const [newPropEmail, setNewPropEmail] = useState('');
  const [newPropOwner, setNewPropOwner] = useState('');
  const [newPropCity, setNewPropCity] = useState('');
  const [newPropUnits, setNewPropUnits] = useState(10);
  const [newPropPlan, setNewPropPlan] = useState<PlanType>('pro');

  const refreshData = () => {
    setClients(storage.getClients());
    setSyncLogs(storage.getSyncLogs());
  };

  // Toggle active / suspended status
  const toggleClientStatus = (client: ClientProperty) => {
    const nextStatus: ClientStatus = client.status === 'active' ? 'suspended' : 'active';
    const updated = { ...client, status: nextStatus };
    storage.updateClient(updated);
    refreshData();
  };

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);

    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesPlan = planFilter === 'all' || c.plan === planFilter;

    return matchesSearch && matchesType && matchesStatus && matchesPlan;
  });

  // Calculate platform high-level stats
  const totalProperties = clients.length;
  const activeProperties = clients.filter((c) => c.status === 'active').length;
  const totalUnits = clients.reduce((acc, c) => acc + (c.units?.length || c.unitsCount || 0), 0);
  const platformMRR = clients.reduce((acc, c) => {
    if (c.paymentStatus !== 'paid' || c.status === 'suspended') return acc;
    const price = c.plan === 'starter' ? 2499 : c.plan === 'pro' ? 4999 : 9999;
    return acc + price;
  }, 0);

  const handleCreateClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropName || !newPropEmail || !newPropCity) return;

    const newClient: ClientProperty = {
      id: `prop-${Date.now().toString().slice(-6)}`,
      name: newPropName,
      type: newPropType,
      ownerName: newPropOwner || 'Manager',
      email: newPropEmail.trim().toLowerCase(),
      password: 'password123',
      phone: '+91 98000 11223',
      city: newPropCity,
      state: 'India',
      unitsCount: newPropType === 'hotel' ? newPropUnits : 1,
      plan: newPropPlan,
      status: 'active',
      paymentStatus: 'paid',
      joinedAt: new Date().toISOString().substring(0, 10),
      syncedOTAs: {
        goibibo: true,
        makeMyTrip: true,
        airbnb: newPropType !== 'hotel',
        bookingCom: true,
        agoda: false,
      },
      dynamicPricing: {
        baseMultiplier: 1.0,
        weekendSurgePercent: 25,
        highDemandSurgePercent: 40,
        seasonFactorPercent: 20,
        manualDateOverrides: {},
      },
      units: [
        {
          id: `u-${Date.now()}-1`,
          propertyId: '',
          name: newPropType === 'hotel' ? 'Room 101' : 'Private Estate Unit',
          category: 'Standard Suite',
          basePrice: 5000,
          maxOccupancy: 3,
          amenities: ['Wi-Fi', 'AC', 'Ensuite Bathroom'],
          currentStatus: 'available',
        },
      ],
      taxDetails: {
        tradeName: newPropName,
        address: newPropCity,
      },
    };

    storage.addClient(newClient);
    refreshData();
    setShowProvisionModal(false);
    setNewPropName('');
    setNewPropEmail('');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#090A0F] text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Admin Top Navigation Bar */}
      <div className={`border-b px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isDark ? 'bg-[#0D0F16] border-white/10' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight">Super Admin Operations Center</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                renusri.work@gmail.com
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Live client inventory, subscription billing, and multi-channel synchronization telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowProvisionModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Manually Onboard Client</span>
          </button>

          <button
            onClick={refreshData}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-semibold flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Admin</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400">Total Properties</span>
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black mt-2">{totalProperties}</div>
            <div className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {activeProperties} active & synchronized
            </div>
          </div>

          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400">Total Keys / Inventory</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black mt-2">{totalUnits} Rooms & Villas</div>
            <div className="text-xs text-gray-400 mt-1">Managed across India destinations</div>
          </div>

          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400">Platform MRR (Paid)</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black mt-2">₹{platformMRR.toLocaleString('en-IN')}</div>
            <div className="text-xs text-gray-400 mt-1">Monthly Recurring Platform SaaS</div>
          </div>

          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400">OTA API Connections</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black mt-2">5 Active Channels</div>
            <div className="text-xs text-emerald-400 font-medium mt-1">MakeMyTrip, Goibibo, Airbnb, Booking</div>
          </div>
        </div>

        {/* Client Management Header & Filters */}
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Onboarded Hospitality Clients</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Inspect registered hotels, villas, and airbnbs. Real-time customer creation from Join form.
              </p>
            </div>

            {/* Search input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search property, owner, email, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs border outline-none ${
                  isDark ? 'bg-black/40 border-white/10 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500'
                }`}
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-white/10 text-xs">
            <span className="text-gray-400 font-semibold flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filters:
            </span>

            {/* Type selector */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className={`px-3 py-1.5 rounded-lg border text-xs outline-none ${
                isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
            >
              <option value="all">All Property Types</option>
              <option value="hotel">Hotels & Resorts</option>
              <option value="villa">Luxury Villas</option>
              <option value="airbnb">Airbnbs & Chalets</option>
            </select>

            {/* Status selector */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className={`px-3 py-1.5 rounded-lg border text-xs outline-none ${
                isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active (Synced)</option>
              <option value="trial">Trial</option>
              <option value="suspended">Suspended</option>
            </select>

            {/* Plan selector */}
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value as any)}
              className={`px-3 py-1.5 rounded-lg border text-xs outline-none ${
                isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
            >
              <option value="all">All Plans</option>
              <option value="starter">Starter (₹2,499)</option>
              <option value="pro">Pro Hotelier (₹4,999)</option>
              <option value="enterprise">Enterprise (₹9,999)</option>
            </select>

            {(searchQuery || typeFilter !== 'all' || statusFilter !== 'all' || planFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('all');
                  setStatusFilter('all');
                  setPlanFilter('all');
                }}
                className="text-[11px] text-orange-400 hover:underline font-semibold ml-2"
              >
                Clear Filters
              </button>
            )}

            <span className="ml-auto text-[11px] text-gray-400 font-mono">
              Showing {filteredClients.length} of {clients.length} clients
            </span>
          </div>

          {/* Clients Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${isDark ? 'border-white/10 text-gray-400' : 'border-slate-200 text-slate-500'}`}>
                  <th className="py-3 px-3 font-semibold">Property & Destination</th>
                  <th className="py-3 px-3 font-semibold">Type</th>
                  <th className="py-3 px-3 font-semibold">Owner & Contact</th>
                  <th className="py-3 px-3 font-semibold">Keys</th>
                  <th className="py-3 px-3 font-semibold">Plan & Payment</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold">OTA Sync</th>
                  <th className="py-3 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredClients.map((client) => {
                  const isSuspended = client.status === 'suspended';
                  return (
                    <tr
                      key={client.id}
                      className={`hover:bg-white/5 transition-colors ${
                        isSuspended ? 'opacity-60' : ''
                      }`}
                    >
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                          <span>{client.name}</span>
                        </div>
                        <div className="text-gray-400 text-[11px] mt-0.5">
                          {client.city}, {client.state}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            client.type === 'hotel'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                              : client.type === 'villa'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-pink-500/10 text-pink-400 border border-pink-500/30'
                          }`}
                        >
                          {client.type}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-medium text-gray-200">{client.ownerName}</div>
                        <div className="text-[11px] text-gray-400 font-mono">{client.email}</div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-bold">{client.units?.length || client.unitsCount}</span>{' '}
                        <span className="text-gray-400">units</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="capitalize font-semibold text-orange-400">{client.plan}</div>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded mt-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Paid
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            client.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : client.status === 'trial'
                              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                              : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              client.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                            }`}
                          />
                          {client.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                          {client.syncedOTAs.makeMyTrip && (
                            <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">MMT</span>
                          )}
                          {client.syncedOTAs.goibibo && (
                            <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">GO</span>
                          )}
                          {client.syncedOTAs.airbnb && (
                            <span className="px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">ABNB</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Impersonate / Open Client PMS */}
                          <button
                            onClick={() => onSelectClientPMS(client)}
                            className="px-2.5 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 font-semibold flex items-center gap-1 transition-all"
                            title="Open this client's PMS dashboard"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>PMS</span>
                          </button>

                          {/* View details */}
                          <button
                            onClick={() => setSelectedClientDetail(client)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300"
                            title="View Property Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle Active / Suspend */}
                          <button
                            onClick={() => toggleClientStatus(client)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              client.status === 'active'
                                ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                            }`}
                            title={client.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global OTA Sync Stream Audit Log */}
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-orange-400" />
              <h3 className="text-base font-bold">Platform-Wide Real-Time 2-Way Sync Stream</h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
              SOCKET TELEMETRY ACTIVE
            </span>
          </div>

          <div className="space-y-2.5">
            {syncLogs.slice(0, 6).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2.5">
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
        </div>
      </div>

      {/* Property Details Modal */}
      {selectedClientDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-xl rounded-2xl border p-6 shadow-2xl relative ${
            isDark ? 'bg-[#0E1017] border-orange-500/30 text-white' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <button
              onClick={() => setSelectedClientDetail(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                {selectedClientDetail.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold">{selectedClientDetail.name}</h3>
                <p className="text-xs text-gray-400">
                  {selectedClientDetail.city}, {selectedClientDetail.state} • ID: {selectedClientDetail.id}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-gray-400 block mb-1">Owner & Email</span>
                <span className="font-semibold text-white block">{selectedClientDetail.ownerName}</span>
                <span className="font-mono text-gray-300">{selectedClientDetail.email}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-gray-400 block mb-1">Inventory / Keys</span>
                <span className="font-semibold text-white block">
                  {selectedClientDetail.units?.length || selectedClientDetail.unitsCount} Registered Keys
                </span>
                <span className="text-orange-400 font-bold uppercase">{selectedClientDetail.type}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs mb-6">
              <span className="text-gray-400 block mb-2 font-semibold">Configured OTA Channels</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedClientDetail.syncedOTAs).map(([ch, active]) => (
                  <span
                    key={ch}
                    className={`px-2 py-1 rounded text-[11px] font-bold ${
                      active
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/5 text-gray-500'
                    }`}
                  >
                    {ch.toUpperCase()}: {active ? 'ACTIVE 2-WAY' : 'DISABLED'}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedClientDetail(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const client = selectedClientDetail;
                  setSelectedClientDetail(null);
                  onSelectClientPMS(client);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/25"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Launch PMS for {selectedClientDetail.name}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Client Provisioning Modal */}
      {showProvisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl relative ${
            isDark ? 'bg-[#0E1017] border-orange-500/30 text-white' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <button
              onClick={() => setShowProvisionModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold mb-1">Manual Client Provisioning</h3>
            <p className="text-xs text-gray-400 mb-4">
              Instantly create a customer account bypassing the public payment gateway.
            </p>

            <form onSubmit={handleCreateClientSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Property Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Heritage Haveli"
                  value={newPropName}
                  onChange={(e) => setNewPropName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Property Type</label>
                  <select
                    value={newPropType}
                    onChange={(e) => setNewPropType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-orange-500"
                  >
                    <option value="hotel">Hotel</option>
                    <option value="villa">Luxury Villa</option>
                    <option value="airbnb">Airbnb Chalet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Udaipur"
                    value={newPropCity}
                    onChange={(e) => setNewPropCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Client Email (Login)</label>
                <input
                  type="email"
                  required
                  placeholder="haveli@udaipur.com"
                  value={newPropEmail}
                  onChange={(e) => setNewPropEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Owner Name</label>
                  <input
                    type="text"
                    placeholder="Bhanwar Singh"
                    value={newPropOwner}
                    onChange={(e) => setNewPropOwner(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Plan Tier</label>
                  <select
                    value={newPropPlan}
                    onChange={(e) => setNewPropPlan(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-orange-500"
                  >
                    <option value="starter">Starter</option>
                    <option value="pro">Pro Hotelier</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProvisionModal(false)}
                  className="px-3 py-2 rounded-xl text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20"
                >
                  Create & Activate Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
