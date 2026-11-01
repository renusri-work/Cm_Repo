import React, { useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  FileSpreadsheet,
  FileText,
  Flame,
  Globe,
  Home,
  Hotel,
  Layers,
  Lock,
  Percent,
  Play,
  Receipt,
  RefreshCw,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Zap,
} from 'lucide-react';
import { ClientProperty, PlanType, PropertyType, Unit } from '../types';
import { storage } from '../services/storage';

interface LandingPageProps {
  onJoinSuccess: (newClient: ClientProperty) => void;
  onOpenLogin: () => void;
  theme: 'dark' | 'light';
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onJoinSuccess,
  onOpenLogin,
  theme,
}) => {
  const isDark = theme === 'dark';

  // Join Form State
  const [propertyName, setPropertyName] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('hotel');
  const [unitsCount, setUnitsCount] = useState<number>(8);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('pro');

  // Dummy Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('hotelier@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [createdClient, setCreatedClient] = useState<ClientProperty | null>(null);

  // Property Type Tab for preview
  const [previewTab, setPreviewTab] = useState<'hotel' | 'villa'>('hotel');

  const getPlanPrice = (plan: PlanType) => {
    switch (plan) {
      case 'starter':
        return 2499;
      case 'pro':
        return 4999;
      case 'enterprise':
        return 9999;
    }
  };

  const handleStartOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyName || !email || !password || !city) {
      alert('Please fill in all mandatory property and contact fields.');
      return;
    }
    setShowPaymentModal(true);
  };

  const executeDummyPayment = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      // Auto-generate realistic rooms or villa listings
      const generatedUnits: Unit[] = [];
      const newClientId = `prop-${Date.now().toString().slice(-6)}`;

      if (propertyType === 'hotel') {
        const categories = ['Standard Deluxe', 'Executive Suite', 'Royal Suite'];
        for (let i = 1; i <= Math.min(unitsCount, 24); i++) {
          const floor = Math.ceil(i / 6);
          const roomNum = floor * 100 + ((i - 1) % 6) + 1;
          const cat = categories[i % categories.length];
          const price = cat === 'Standard Deluxe' ? 3800 : cat === 'Executive Suite' ? 5500 : 9200;
          generatedUnits.push({
            id: `u-${roomNum}`,
            propertyId: newClientId,
            name: `Room ${roomNum}`,
            category: cat,
            floor,
            basePrice: price,
            maxOccupancy: 3,
            amenities: ['High-Speed Wi-Fi', 'Smart TV', 'Air Conditioning', 'Ensuite Bathroom'],
            currentStatus: i === 1 ? 'occupied' : 'available',
          });
        }
      } else {
        // Villa / Airbnb
        generatedUnits.push({
          id: `u-estate-1`,
          propertyId: newClientId,
          name: propertyType === 'villa' ? `${propertyName} (Whole Estate)` : `${propertyName} (Private Retreat)`,
          category: propertyType === 'villa' ? 'Private Luxury Villa' : 'Entire Boutique Stay',
          basePrice: propertyType === 'villa' ? 24000 : 7500,
          maxOccupancy: propertyType === 'villa' ? 10 : 4,
          amenities: ['Private Pool', 'Chef Kitchen', 'Lawn Deck', 'Wi-Fi', 'Dedicated Caretaker'],
          currentStatus: 'available',
        });
      }

      const newClientObj: ClientProperty = {
        id: newClientId,
        name: propertyName,
        type: propertyType,
        ownerName: ownerName || 'Valued Partner',
        email: email.trim().toLowerCase(),
        password,
        phone: phone || '+91 98000 00000',
        city,
        state: state || 'India',
        unitsCount: propertyType === 'hotel' ? unitsCount : 1,
        plan: selectedPlan,
        status: 'active',
        paymentStatus: 'paid',
        joinedAt: new Date().toISOString().substring(0, 10),
        syncedOTAs: {
          goibibo: true,
          makeMyTrip: true,
          airbnb: propertyType !== 'hotel',
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
        units: generatedUnits,
        taxDetails: {
          tradeName: propertyName,
          address: `${city}, ${state || 'India'}`,
        },
      };

      storage.addClient(newClientObj);
      setCreatedClient(newClientObj);
      setIsProcessingPayment(false);
      setPaymentDone(true);
    }, 1200);
  };

  const handleFinishAndEnter = () => {
    if (createdClient) {
      setShowPaymentModal(false);
      onJoinSuccess(createdClient);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#08090D] text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Neon Glow Backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-orange-600/20 via-amber-500/20 to-transparent blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-orange-500/10 blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Live Indicator Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Real-Time 2-Way Sync Engine • Zero Double Bookings</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              The Next-Gen OS for{' '}
              <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                Hotels, Airbnbs & Luxury Villas
              </span>
            </h1>

            <p className="text-base sm:text-xl text-gray-400 leading-relaxed mb-8">
              Seamlessly sync with <span className="text-orange-400 font-semibold">MakeMyTrip, Goibibo & Airbnb</span> in real time. Take offline walk-ins, customize room service & laundry folios, download instant quotations, and automate your monthly & yearly hospitality GST filings.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#join-section"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-base shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                <span>Onboard Your Property Now</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>

              <button
                onClick={onOpenLogin}
                className={`w-full sm:w-auto px-7 py-4 rounded-xl font-bold text-base border flex items-center justify-center gap-2 transition-all ${
                  isDark
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                    : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <Lock className="w-4 h-4 text-orange-400" />
                <span>Client & Admin Login</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-white/10">
              <div className="text-center p-3">
                <div className="text-2xl sm:text-3xl font-black text-orange-400">180ms</div>
                <div className="text-xs text-gray-400 font-medium mt-1">OTA Sync Latency</div>
              </div>
              <div className="text-center p-3">
                <div className="text-2xl sm:text-3xl font-black text-amber-400">100%</div>
                <div className="text-xs text-gray-400 font-medium mt-1">No Double Bookings</div>
              </div>
              <div className="text-center p-3">
                <div className="text-2xl sm:text-3xl font-black text-orange-400">1-Click</div>
                <div className="text-xs text-gray-400 font-medium mt-1">GST & Tax Invoices</div>
              </div>
              <div className="text-center p-3">
                <div className="text-2xl sm:text-3xl font-black text-amber-400">+28%</div>
                <div className="text-xs text-gray-400 font-medium mt-1">Direct RevPAR Uplift</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2-Way Channel Manager Real-Time Sync Section */}
      <section id="channel-manager" className={`py-16 border-y ${isDark ? 'bg-[#0D0F15] border-white/10' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              Bi-Directional Channel Manager
            </span>
            <h2 className="text-3xl font-bold tracking-tight mt-3">
              Real-Time Two-Way OTA Synchronization
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Bookings made on Goibibo or MakeMyTrip instantly lock rooms in your PMS. When you book a walk-in at reception, the inventory is blocked across all online portals immediately!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { name: 'MakeMyTrip', type: 'Direct API Partner', color: 'from-red-500 to-rose-600', ping: '110ms', tag: 'Hotel & Homestay' },
              { name: 'Goibibo', type: 'Instant Webhook', color: 'from-orange-500 to-amber-600', ping: '135ms', tag: 'Fast Booking Flow' },
              { name: 'Airbnb', type: 'iCal & Sync Engine', color: 'from-pink-500 to-rose-500', ping: '160ms', tag: 'Villas & Airbnbs' },
              { name: 'Booking.com', type: 'ARI Channel API', color: 'from-blue-600 to-indigo-700', ping: '190ms', tag: 'Global Inbound' },
              { name: 'Agoda', type: 'YCS Integration', color: 'from-emerald-500 to-teal-600', ping: '210ms', tag: 'APAC Guests' },
            ].map((ota) => (
              <div
                key={ota.name}
                className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] ${
                  isDark ? 'bg-black/40 border-white/10 hover:border-orange-500/40' : 'bg-slate-50 border-slate-200 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                    {ota.ping}
                  </span>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${ota.color} flex items-center justify-center text-white font-bold text-sm mb-3 shadow-md`}>
                  {ota.name.slice(0, 2).toUpperCase()}
                </div>
                <h3 className="font-bold text-base">{ota.name}</h3>
                <p className="text-xs text-orange-400 font-medium mt-0.5">{ota.type}</p>
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                  <span>Category</span>
                  <span className="font-semibold text-gray-300">{ota.tag}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-8 p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isDark ? 'bg-orange-500/5 border-orange-500/20' : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <p className="text-xs text-gray-300">
                <strong className="text-orange-400">Double-Booking Guard Active:</strong> Every offline walk-in reservation immediately dispatches XML & JSON payload triggers to all linked OTAs, guaranteeing zero overlap.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 shrink-0">
              SYNC STATUS: 100% HEALTHY
            </span>
          </div>
        </div>
      </section>

      {/* Hotel vs Villa Distinct Experience Showcase */}
      <section id="comparison" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              Tailored Workflows
            </span>
            <h2 className="text-3xl font-bold tracking-tight mt-3">
              Designed Differently for Hotels vs. Airbnbs & Private Villas
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Unlike cookie-cutter software, AuraStay switches workflows depending on whether you run a multi-room hotel with floor grids or an entire private luxury villa / Airbnb chalet.
            </p>

            {/* Toggle Tab */}
            <div className={`inline-flex p-1 rounded-xl border mt-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-200 border-slate-300'}`}>
              <button
                onClick={() => setPreviewTab('hotel')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  previewTab === 'hotel'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Hotel className="w-4 h-4" /> Hotel Room PMS View
              </button>
              <button
                onClick={() => setPreviewTab('villa')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  previewTab === 'villa'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Home className="w-4 h-4" /> Airbnb & Villa Estate View
              </button>
            </div>
          </div>

          {/* Interactive Feature Matrix */}
          <div className={`rounded-2xl border p-6 sm:p-8 ${isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-md'}`}>
            {previewTab === 'hotel' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/30">
                      HOTEL OPERATIONS MATRIX
                    </span>
                    <span className="text-xs text-gray-400">Floor-wise Key Allocation</span>
                  </div>
                  <h3 className="text-2xl font-bold">Multi-Floor Room Grids & Quick Front-Desk Turnaround</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Organize Deluxe, Executive, and Presidential Suites by floor numbers. Check guests in with Aadhaar or Passport ID proof, assign digital keycards, and manage housekeeping statuses (Clean, Dirty, Occupied, Reserved) at a glance.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs font-bold text-orange-400 flex items-center gap-1.5 mb-1">
                        <UtensilsCrossed className="w-3.5 h-3.5" /> Food & Beverage Folios
                      </div>
                      <p className="text-[11px] text-gray-400">Add buffet breakfast, in-room dining, midnight snacks with 5% GST directly to room bill.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs font-bold text-orange-400 flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3.5 h-3.5" /> Laundry & Upgrades
                      </div>
                      <p className="text-[11px] text-gray-400">Charge dry cleaning, suite upgrades, and airport transfers with 18% service GST.</p>
                    </div>
                  </div>
                </div>

                {/* Visual Mini Room Matrix Mock */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-black/60 border-orange-500/30' : 'bg-slate-100 border-slate-300'}`}>
                  <div className="text-xs font-bold text-gray-300 mb-3 flex items-center justify-between">
                    <span>Floor 1 & 2 Live Keys</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">80% Occupancy</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { num: '101', type: 'Deluxe', st: 'OCCUPIED', bg: 'bg-orange-500/20 border-orange-500/50 text-orange-300' },
                      { num: '102', type: 'Deluxe', st: 'AVAILABLE', bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' },
                      { num: '103', type: 'Suite', st: 'RESERVED', bg: 'bg-purple-500/20 border-purple-500/40 text-purple-300' },
                      { num: '201', type: 'Royal Suite', st: 'OCCUPIED', bg: 'bg-orange-500/20 border-orange-500/50 text-orange-300' },
                      { num: '202', type: 'Deluxe', st: 'DIRTY', bg: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' },
                      { num: '301', type: 'Maharaja', st: 'OCCUPIED', bg: 'bg-orange-500/20 border-orange-500/50 text-orange-300' },
                    ].map((r) => (
                      <div key={r.num} className={`p-2.5 rounded-lg border text-center ${r.bg}`}>
                        <div className="text-xs font-bold">{r.num}</div>
                        <div className="text-[10px] text-gray-400">{r.type}</div>
                        <div className="text-[9px] font-mono mt-1 font-bold">{r.st}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
                      AIRBNB & PRIVATE VILLA ESTATE
                    </span>
                    <span className="text-xs text-gray-400">Entire Estate Calendar</span>
                  </div>
                  <h3 className="text-2xl font-bold">Whole-Property Blocking, Minimum Stays & Host Add-ons</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Designed for private holiday homes, beachside pool villas in Goa, and mountain chalets in Manali. Lock the entire property for a group, handle security deposits, enforce minimum night policies, and bill bespoke services like private villa BBQ chefs and pool heating.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                        <Users className="w-3.5 h-3.5" /> Group Party Roster
                      </div>
                      <p className="text-[11px] text-gray-400">Accommodates 8 to 16 guests per stay with single-click combined guest folio.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                        <Flame className="w-3.5 h-3.5" /> Bespoke Host Add-ons
                      </div>
                      <p className="text-[11px] text-gray-400">Add Private Chef Barbecue, Bonfire firewood kits, and Cabana cocktail services.</p>
                    </div>
                  </div>
                </div>

                {/* Visual Villa Mock */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-black/60 border-amber-500/30' : 'bg-slate-100 border-slate-300'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">Casa Solara Villa (4BHK)</span>
                    <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">Goa Estate</span>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 mb-2">
                    <div className="flex justify-between text-xs font-bold text-orange-300">
                      <span>Oct 29 – Nov 02 (4 Nights)</span>
                      <span>PAID</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">Guest: Zoya Merchant (8 Guests)</p>
                    <div className="text-[10px] text-gray-400 mt-1">Source: <span className="text-pink-400 font-bold">Airbnb Instant</span></div>
                  </div>
                  <div className="text-[11px] text-gray-400 flex justify-between">
                    <span>Base Tariff: ₹28,000/night</span>
                    <span className="text-emerald-400 font-bold">Next Open: Nov 03</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Overview Cards */}
      <section id="features" className={`py-16 border-t ${isDark ? 'bg-[#0A0C11] border-white/10' : 'bg-slate-100 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              End-to-End Capabilities
            </span>
            <h2 className="text-3xl font-bold tracking-tight mt-3">
              Everything Your Hotel or Villa Front Desk Needs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-2xl border transition-all ${isDark ? 'bg-[#0E1017] border-white/10 hover:border-orange-500/40' : 'bg-white border-slate-200'}`}>
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-4 border border-orange-500/20">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Downloadable Quotation & Official Bill</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Generate clean estimate quotations for prospective guests, and upon payment confirmation, automatically issue official printable tax receipts complete with GST details, itemized food/laundry services, and digital verification seal.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border transition-all ${isDark ? 'bg-[#0E1017] border-white/10 hover:border-orange-500/40' : 'bg-white border-slate-200'}`}>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Automated GST Filing Engine</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Hospitality tax compliance made effortless. Automatically calculates 12% vs 18% room tariff slabs, 5% F&B restaurant taxes, and 18% laundry/upgrades. Exports monthly & annual GSTR summaries in CSV ready for your chartered accountant.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border transition-all ${isDark ? 'bg-[#0E1017] border-white/10 hover:border-orange-500/40' : 'bg-white border-slate-200'}`}>
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-4 border border-orange-500/20">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Real-Time Occupancy & 2-Day Forecast</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Live dashboard indicators showcase current guests in each room/villa, revenue trends, today's check-ins and check-outs, and arriving bookings for the next 2 days to prepare housekeeping and front-desk staff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              Transparent Membership
            </span>
            <h2 className="text-3xl font-bold tracking-tight mt-3">
              Affordable Pricing for Every Hospitality Scale
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Instant activation with dummy payment simulation. Automatic client account creation!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className={`rounded-2xl border p-6 flex flex-col justify-between ${
              selectedPlan === 'starter'
                ? 'border-orange-500 ring-2 ring-orange-500/30 bg-orange-500/5'
                : isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200'
            }`}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Starter</span>
                <h3 className="text-xl font-bold mt-1">Airbnbs & Chalets</h3>
                <p className="text-xs text-gray-400 mt-1">Up to 3 listings or private chalets</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-black">₹2,499</span>
                  <span className="text-xs text-gray-400"> / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-gray-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-400" /> Airbnb & MakeMyTrip 2-Way Sync</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-400" /> Offline Walk-in Billing</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-400" /> Quotation & PDF Bill Receipts</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-400" /> Automated GST Filing Report</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedPlan('starter');
                  const el = document.getElementById('join-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full mt-6 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  selectedPlan === 'starter'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-gray-300'
                }`}
              >
                {selectedPlan === 'starter' ? 'Selected Plan' : 'Choose Starter'}
              </button>
            </div>

            {/* Pro Plan (Most Popular) */}
            <div className={`rounded-2xl border p-6 flex flex-col justify-between relative ${
              selectedPlan === 'pro'
                ? 'border-orange-500 ring-2 ring-orange-500/40 bg-gradient-to-b from-orange-500/10 to-transparent'
                : isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200'
            }`}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md">
                Most Popular for Hotels
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Pro Hotelier</span>
                <h3 className="text-xl font-bold mt-1">Boutique Hotels & Villas</h3>
                <p className="text-xs text-gray-400 mt-1">Up to 25 rooms or multi-unit villas</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-black">₹4,999</span>
                  <span className="text-xs text-gray-400"> / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-gray-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-400" /> MakeMyTrip, Goibibo, Airbnb & Booking.com</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-400" /> Dynamic Weekend & Demand Pricing</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-400" /> Room Service & Laundry Folios</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-400" /> Real-time 2-Day Arrival Tracking</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-400" /> GSTR-1 & GSTR-3B Tax Exports</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedPlan('pro');
                  const el = document.getElementById('join-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full mt-6 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  selectedPlan === 'pro'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-white/10 hover:bg-white/20 text-gray-300'
                }`}
              >
                {selectedPlan === 'pro' ? 'Selected Plan' : 'Choose Pro Hotelier'}
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className={`rounded-2xl border p-6 flex flex-col justify-between ${
              selectedPlan === 'enterprise'
                ? 'border-orange-500 ring-2 ring-orange-500/30 bg-orange-500/5'
                : isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200'
            }`}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Enterprise</span>
                <h3 className="text-xl font-bold mt-1">Resorts & Chains</h3>
                <p className="text-xs text-gray-400 mt-1">Unlimited keys, multi-property franchise</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-black">₹9,999</span>
                  <span className="text-xs text-gray-400"> / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-gray-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-400" /> All OTAs + Agoda + Expedia API</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-400" /> Dedicated Account Manager & CA Support</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-400" /> Custom GSTIN multi-state invoicing</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-400" /> 24/7 Priority Emergency Channel Support</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedPlan('enterprise');
                  const el = document.getElementById('join-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full mt-6 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  selectedPlan === 'enterprise'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-gray-300'
                }`}
              >
                {selectedPlan === 'enterprise' ? 'Selected Plan' : 'Choose Enterprise'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* JOIN / ONBOARDING FORM SECTION */}
      <section id="join-section" className={`py-20 border-t ${isDark ? 'bg-[#0B0D13] border-white/10' : 'bg-slate-100 border-slate-200'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Instant Client Onboarding
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Onboard Your Property & Activate PMS Dashboard
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Fill the onboarding form below. After dummy payment confirmation, your client profile is automatically registered and reflected in the Admin dashboard!
            </p>
          </div>

          <div className={`rounded-2xl border p-6 sm:p-10 shadow-2xl ${isDark ? 'bg-[#0E1017] border-orange-500/30 shadow-orange-500/5' : 'bg-white border-orange-200'}`}>
            <form onSubmit={handleStartOnboarding} className="space-y-6">
              {/* Property Details */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-orange-400 mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> 1. Property Particulars
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Property Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Orchid Resort & Spa"
                      value={propertyName}
                      onChange={(e) => setPropertyName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all ${
                        isDark ? 'bg-black/40 border-white/10 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Property Classification *
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all ${
                        isDark ? 'bg-black/40 border-white/10 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500'
                      }`}
                    >
                      <option value="hotel">Hotel / Resort (Multi-room, floor grid)</option>
                      <option value="villa">Luxury Private Villa (Whole property estate)</option>
                      <option value="airbnb">Airbnb / Homestay / Chalet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      {propertyType === 'hotel' ? 'Total Number of Rooms / Keys *' : 'Number of Units / Villas *'}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={200}
                      required
                      value={unitsCount}
                      onChange={(e) => setUnitsCount(parseInt(e.target.value) || 1)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all ${
                        isDark ? 'bg-black/40 border-white/10 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      City / Destination *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Udaipur / Goa / Manali"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all ${
                        isDark ? 'bg-black/40 border-white/10 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Account Credentials */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-orange-400 mb-4 flex items-center gap-2">
                  <Lock className="w-4 h-4" /> 2. Owner & Login Credentials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Owner / General Manager Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Renuka Rao"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all ${
                        isDark ? 'bg-black/40 border-white/10 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98450 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all ${
                        isDark ? 'bg-black/40 border-white/10 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Client Login Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="manager@hotel.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all ${
                        isDark ? 'bg-black/40 border-white/10 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500'
                      }`}
                    />
                    <p className="text-[10px] text-gray-400 mt-1">This will be your client portal login email.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Set Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all ${
                        isDark ? 'bg-black/40 border-white/10 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Plan Confirmation */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> 3. Selected Plan & Summary
                  </h3>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                    Plan: {selectedPlan.toUpperCase()} (₹{getPlanPrice(selectedPlan).toLocaleString('en-IN')}/mo)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {(['starter', 'pro', 'enterprise'] as PlanType[]).map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setSelectedPlan(p)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        selectedPlan === p
                          ? 'border-orange-500 bg-orange-500/10 text-orange-400 font-bold'
                          : 'border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <div className="text-xs uppercase">{p}</div>
                      <div className="text-sm font-black mt-0.5">₹{getPlanPrice(p).toLocaleString('en-IN')}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                <span>Proceed to Dummy Payment (₹{getPlanPrice(selectedPlan).toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* DUMMY PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className={`w-full max-w-lg rounded-2xl border p-6 sm:p-8 shadow-2xl relative ${
            isDark ? 'bg-[#0E1017] border-orange-500/40 text-white' : 'bg-white border-orange-200 text-slate-900'
          }`}>
            {!paymentDone ? (
              <>
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold">
                      ₹
                    </div>
                    <div>
                      <h3 className="font-bold text-base">AuraStay Payment Gateway</h3>
                      <p className="text-[11px] text-gray-400">Sandbox Simulation Environment</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/30">
                    TEST MODE
                  </span>
                </div>

                <div className="my-5 p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400">Subscription for {propertyName}</p>
                    <p className="text-sm font-bold text-white capitalize">{selectedPlan} Tier • 1 Month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total Payable</p>
                    <p className="text-xl font-black text-orange-400">
                      ₹{getPlanPrice(selectedPlan).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { id: 'upi', label: 'UPI / QR', icon: Zap },
                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                    { id: 'netbanking', label: 'NetBanking', icon: Building2 },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                          paymentMethod === m.id
                            ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                            : 'border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {paymentMethod === 'upi' && (
                  <div className="space-y-3 mb-6">
                    <label className="block text-xs text-gray-300">Enter Virtual Payment Address (UPI ID)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-sm bg-black/40 border border-white/10 text-white outline-none focus:border-orange-500"
                    />
                    <div className="flex gap-2">
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Google Pay</span>
                      <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">PhonePe</span>
                      <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">Paytm UPI</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-3 mb-6">
                    <label className="block text-xs text-gray-300">Card Number (Dummy test card)</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-sm bg-black/40 border border-white/10 text-white outline-none focus:border-orange-500 font-mono"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        defaultValue="12/28"
                        className="px-3 py-2 rounded-xl text-xs bg-black/40 border border-white/10 text-white text-center font-mono"
                      />
                      <input
                        type="text"
                        defaultValue="894"
                        className="px-3 py-2 rounded-xl text-xs bg-black/40 border border-white/10 text-white text-center font-mono"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="mb-6 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300">
                    <p className="font-semibold text-orange-400 mb-1">Simulated Direct Bank Gateway</p>
                    <p>HDFC Bank, ICICI Bank, State Bank of India, Axis Bank supported with instant sandbox callback.</p>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="w-1/3 py-3 rounded-xl text-xs font-semibold text-gray-400 hover:text-white border border-white/10"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={isProcessingPayment}
                    onClick={executeDummyPayment}
                    className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying Dummy Payment...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Pay ₹{getPlanPrice(selectedPlan).toLocaleString('en-IN')} & Create Client</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              /* Success Confirmation */
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <BadgeCheck className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-white">Payment Confirmed!</h3>
                <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mt-1">
                  Automatic Customer Profile Created
                </p>
                <div className="my-5 p-4 rounded-xl bg-white/5 border border-white/10 text-left text-xs space-y-1.5 text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Property:</span>
                    <span className="font-bold text-white">{createdClient?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="font-semibold text-orange-400 uppercase">{createdClient?.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Login Email:</span>
                    <span className="font-mono text-amber-300">{createdClient?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Keys / Units Setup:</span>
                    <span className="font-bold">{createdClient?.units.length} Active Keys</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Admin Reflection:</span>
                    <span className="text-emerald-400 font-bold">Synchronized to Super Admin</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFinishAndEnter}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2"
                >
                  <span>Enter Your Property Dashboard Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`py-12 border-t ${isDark ? 'bg-black/60 border-white/10 text-gray-400' : 'bg-white border-slate-200 text-slate-600'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-orange-500">AuraStay Hospitality OS</span>
            <span>•</span>
            <span>All-in-One PMS, Channel Manager & Tax Invoicing</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onOpenLogin} className="hover:text-orange-400">
              Admin Access (renusri.work@gmail.com)
            </button>
            <a href="#features" className="hover:text-orange-400">Features</a>
            <a href="#pricing" className="hover:text-orange-400">Pricing</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
