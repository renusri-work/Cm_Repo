import React, { useState } from 'react';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileText,
  Filter,
  Plus,
  Receipt,
  Search,
  Sparkles,
  Trash2,
  User,
  Users,
  UtensilsCrossed,
  X,
  Zap,
} from 'lucide-react';
import {
  AddonCharge,
  Booking,
  ClientProperty,
  TaxBreakdown,
  Unit,
} from '../../types';
import { calculateTaxes, storage } from '../../services/storage';

interface OfflineBookingTabProps {
  client: ClientProperty;
  bookings: Booking[];
  onRefresh: () => void;
  onOpenReceiptModal: (booking: Booking, mode: 'quotation' | 'receipt') => void;
  preselectedUnit?: Unit;
  preselectedDate?: string;
  theme: 'dark' | 'light';
}

export const OfflineBookingTab: React.FC<OfflineBookingTabProps> = ({
  client,
  bookings,
  onRefresh,
  onOpenReceiptModal,
  preselectedUnit,
  preselectedDate,
  theme,
}) => {
  const isDark = theme === 'dark';
  const isHotel = client.type === 'hotel';

  // Modal / Form state
  const [showNewBookingForm, setShowNewBookingForm] = useState(Boolean(preselectedUnit));
  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    preselectedUnit?.id || client.units.find((u) => u.currentStatus === 'available')?.id || ''
  );
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [idProofType, setIdProofType] = useState<'Aadhaar' | 'Passport' | 'Driving License'>('Aadhaar');
  const [idProofNumber, setIdProofNumber] = useState('');
  const [checkInDate, setCheckInDate] = useState(preselectedDate || '2026-11-01');
  const [checkOutDate, setCheckOutDate] = useState('2026-11-03');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cash'>('upi');
  const [notes, setNotes] = useState('');

  // Add-ons list for new booking
  const [addonCharges, setAddonCharges] = useState<AddonCharge[]>([]);

  // Add-ons to existing stay modal
  const [editingBookingForAddons, setEditingBookingForAddons] = useState<Booking | null>(null);
  const [customAddonName, setCustomAddonName] = useState('');
  const [customAddonCategory, setCustomAddonCategory] = useState<'food' | 'laundry' | 'room_upgrade' | 'amenity' | 'transport'>('food');
  const [customAddonPrice, setCustomAddonPrice] = useState(500);
  const [customAddonQty, setCustomAddonQty] = useState(1);

  // Search & Filter existing bookings
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked_in' | 'confirmed' | 'checked_out'>('all');

  const selectedUnit = client.units.find((u) => u.id === selectedUnitId);
  const baseTariff = selectedUnit?.basePrice || 4800;

  // Calculate nights
  const d1 = new Date(checkInDate);
  const d2 = new Date(checkOutDate);
  const diffTime = Math.max(1, d2.getTime() - d1.getTime());
  const numberOfNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Live tax calculations
  const taxBreakdown: TaxBreakdown = calculateTaxes(baseTariff, numberOfNights, addonCharges);

  // Quick preset add-on adder
  const addPresetAddon = (
    name: string,
    category: 'food' | 'laundry' | 'room_upgrade' | 'amenity' | 'transport',
    unitPrice: number,
    gstRatePercent: number
  ) => {
    const newItem: AddonCharge = {
      id: `ad-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      category,
      quantity: 1,
      unitPrice,
      gstRatePercent,
      addedAt: new Date().toISOString().substring(0, 16).replace('T', ' '),
    };
    setAddonCharges([...addonCharges, newItem]);
  };

  const removeAddon = (id: string) => {
    setAddonCharges(addonCharges.filter((item) => item.id !== id));
  };

  const handleCreateBooking = (actionType: 'confirm_receipt' | 'quotation_only') => {
    if (!guestName || !selectedUnitId || !idProofNumber) {
      alert('Please fill in Guest Name, Room/Unit, and ID Proof number.');
      return;
    }

    const bookingId = `BK-${Date.now().toString().slice(-5)}`;
    const newBooking: Booking = {
      id: bookingId,
      propertyId: client.id,
      guestName,
      guestEmail: guestEmail || `${guestName.toLowerCase().replace(/\s+/g, '')}@guest.in`,
      guestPhone: guestPhone || '+91 98000 12345',
      idProofType,
      idProofNumber,
      checkInDate,
      checkOutDate,
      unitId: selectedUnitId,
      unitName: selectedUnit?.name || 'Standard Unit',
      source: 'walkin',
      status: actionType === 'confirm_receipt' ? 'checked_in' : 'confirmed',
      guestsCount: { adults, children },
      baseTariffPerNight: baseTariff,
      numberOfNights,
      addonCharges,
      paymentStatus: actionType === 'confirm_receipt' ? 'paid' : 'pending',
      paymentMethod,
      taxBreakdown,
      paidAmount: actionType === 'confirm_receipt' ? taxBreakdown.grandTotal : 0,
      createdAt: new Date().toISOString().substring(0, 16).replace('T', ' '),
      notes,
    };

    storage.createBooking(newBooking);
    onRefresh();

    // Reset Form
    setShowNewBookingForm(false);
    setGuestName('');
    setGuestPhone('');
    setIdProofNumber('');
    setAddonCharges([]);

    // Open appropriate modal (Receipt or Quotation)
    if (actionType === 'confirm_receipt') {
      onOpenReceiptModal(newBooking, 'receipt');
    } else {
      onOpenReceiptModal(newBooking, 'quotation');
    }
  };

  // Add-on to existing stay
  const handleAddChargeToExistingStay = () => {
    if (!editingBookingForAddons || !customAddonName) return;

    const gstRate = customAddonCategory === 'food' ? 5 : 18;
    const newCharge: AddonCharge = {
      id: `ad-${Date.now()}`,
      category: customAddonCategory,
      name: customAddonName,
      quantity: customAddonQty,
      unitPrice: customAddonPrice,
      gstRatePercent: gstRate,
      addedAt: new Date().toISOString().substring(0, 16).replace('T', ' '),
    };

    const updatedAddons = [...editingBookingForAddons.addonCharges, newCharge];
    const newTaxes = calculateTaxes(
      editingBookingForAddons.baseTariffPerNight,
      editingBookingForAddons.numberOfNights,
      updatedAddons
    );

    const updatedBooking: Booking = {
      ...editingBookingForAddons,
      addonCharges: updatedAddons,
      taxBreakdown: newTaxes,
      paidAmount: editingBookingForAddons.paymentStatus === 'paid' ? newTaxes.grandTotal : editingBookingForAddons.paidAmount,
    };

    storage.updateBooking(updatedBooking);
    onRefresh();
    setEditingBookingForAddons(null);
    setCustomAddonName('');
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guestPhone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Action Header */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded border border-orange-500/30">
              Front Desk Billing POS
            </span>
            <span className="text-xs text-gray-400">Offline Walk-ins & Guest Folios</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Offline Booking, Add-on Services & Folio Billing</h2>
          <p className="text-xs text-gray-400 mt-1">
            Register guests, bill food & laundry, issue pro-forma quotations, and download official GST tax receipts.
          </p>
        </div>

        <button
          onClick={() => setShowNewBookingForm(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Offline Walk-in Reservation</span>
        </button>
      </div>

      {/* NEW OFFLINE BOOKING FORM MODAL / COLLAPSIBLE */}
      {showNewBookingForm && (
        <div className={`p-6 sm:p-8 rounded-2xl border ${
          isDark ? 'bg-[#0D0F17] border-orange-500/30 shadow-2xl shadow-orange-500/10' : 'bg-white border-orange-300 shadow-xl'
        }`}>
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base">New Offline Walk-in / Telephone Reservation</h3>
                <p className="text-xs text-gray-400">
                  Real-time synchronization will lock this key on MakeMyTrip, Goibibo, and Airbnb automatically.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowNewBookingForm(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Column 1 & 2: Room & Guest Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Unit & Dates */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-3 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> 1. Select Room / Villa & Dates
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      {isHotel ? 'Room / Unit *' : 'Villa Listing *'}
                    </label>
                    <select
                      value={selectedUnitId}
                      onChange={(e) => setSelectedUnitId(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                        isDark ? 'bg-black/50 border-white/10 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-orange-500'
                      }`}
                    >
                      {client.units.map((u) => (
                        <option key={u.id} value={u.id} disabled={u.currentStatus === 'occupied'}>
                          {u.name} ({u.category}) - ₹{u.basePrice}
                          {u.currentStatus === 'occupied' ? ' [OCCUPIED]' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Check-in Date *</label>
                    <input
                      type="date"
                      required
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                        isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Check-out Date *</label>
                    <input
                      type="date"
                      required
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                        isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Guest Details */}
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-3 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> 2. Guest Identity & Contact
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Guest Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Advait Sharma"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                        isDark ? 'bg-black/50 border-white/10 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98450 99887"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                        isDark ? 'bg-black/50 border-white/10 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Govt ID Proof Type *</label>
                    <select
                      value={idProofType}
                      onChange={(e) => setIdProofType(e.target.value as any)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                        isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="Aadhaar">Aadhaar Card</option>
                      <option value="Passport">Passport</option>
                      <option value="Driving License">Driving License</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">ID Number / Hash *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 7842-9910-3341"
                      value={idProofNumber}
                      onChange={(e) => setIdProofNumber(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-mono ${
                        isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Services & Charges (Food, Laundry, Upgrades) */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                    <UtensilsCrossed className="w-3.5 h-3.5" /> 3. Additional Services (Food, Laundry & Upgrades)
                  </h4>
                  <span className="text-[11px] text-gray-400">Quick Folio Presets:</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => addPresetAddon('Buffet Breakfast', 'food', 450, 5)}
                    className="px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300 hover:bg-orange-500/20 text-xs font-medium"
                  >
                    + Buffet Breakfast (₹450, 5% GST)
                  </button>
                  <button
                    type="button"
                    onClick={() => addPresetAddon('Dinner Thali Special', 'food', 750, 5)}
                    className="px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300 hover:bg-orange-500/20 text-xs font-medium"
                  >
                    + Dinner Thali (₹750, 5% GST)
                  </button>
                  <button
                    type="button"
                    onClick={() => addPresetAddon('Express Laundry & Press', 'laundry', 350, 18)}
                    className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 text-xs font-medium"
                  >
                    + Laundry Service (₹350, 18% GST)
                  </button>
                  <button
                    type="button"
                    onClick={() => addPresetAddon('Luxury Airport Cab Transfer', 'transport', 1800, 18)}
                    className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20 text-xs font-medium"
                  >
                    + Airport Transfer (₹1,800, 18% GST)
                  </button>
                </div>

                {addonCharges.length > 0 && (
                  <div className="space-y-2">
                    {addonCharges.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-semibold text-white">{item.name}</span>
                          <span className="text-[10px] text-gray-400 ml-2">
                            (Qty: {item.quantity} • ₹{item.unitPrice} • {item.gstRatePercent}% GST)
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-orange-400 font-mono">
                            ₹{item.quantity * item.unitPrice}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeAddon(item.id)}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: Live Tax & Settlement Summary */}
            <div className={`p-5 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-black/60 border-orange-500/30' : 'bg-slate-50 border-orange-200'
            }`}>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-3 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5" /> Billing & Tax Estimation
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-300">
                    <span>Room Nights ({numberOfNights}N @ ₹{baseTariff}):</span>
                    <span className="font-semibold text-white">₹{taxBreakdown.roomSubtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-orange-400 text-[11px]">
                    <span>Room GST ({taxBreakdown.roomGstRate}% Indian Slab):</span>
                    <span>₹{taxBreakdown.roomGst.toLocaleString('en-IN')}</span>
                  </div>

                  {taxBreakdown.addonSubtotal > 0 && (
                    <>
                      <div className="flex justify-between text-gray-300 pt-1 border-t border-white/10">
                        <span>Additional Services Subtotal:</span>
                        <span className="font-semibold text-white">₹{taxBreakdown.addonSubtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-orange-400 text-[11px]">
                        <span>Add-ons GST (F&B 5% / Laundry 18%):</span>
                        <span>₹{taxBreakdown.addonGst.toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between text-gray-400 text-[11px] pt-1 border-t border-white/10">
                    <span>CGST (Central):</span>
                    <span>₹{taxBreakdown.cgst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-[11px]">
                    <span>SGST (State):</span>
                    <span>₹{taxBreakdown.sgst.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-base font-black text-white pt-2 border-t-2 border-orange-500/40">
                    <span>Grand Total:</span>
                    <span className="text-orange-400">₹{taxBreakdown.grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Settlement Method */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1.5">Payment Method</label>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    {(['upi', 'card', 'cash'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPaymentMethod(m)}
                        className={`py-1.5 rounded-lg border text-center font-bold uppercase transition-all ${
                          paymentMethod === m
                            ? 'bg-orange-500 text-white border-orange-500 shadow'
                            : 'border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Quotation vs Receipt */}
              <div className="space-y-2 mt-6">
                <button
                  type="button"
                  onClick={() => handleCreateBooking('quotation_only')}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-orange-400" />
                  <span>Generate Downloadable Quotation</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCreateBooking('confirm_receipt')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-0.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Payment & Issue Official Receipt</span>
                </button>

                <p className="text-[10px] text-gray-400 text-center mt-1">
                  Locks room immediately on MakeMyTrip, Goibibo & Airbnb to prevent double-booking.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXISTING BOOKINGS LIST & FOLIO MANAGEMENT */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold">Guest Bookings & Active Folios</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Track check-ins, append room service / laundry bills, download quotations and tax invoices
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search guest, unit, booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border outline-none ${
                  isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className={`px-3 py-1.5 rounded-xl text-xs border outline-none ${
                isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
            >
              <option value="all">All Statuses</option>
              <option value="checked_in">Checked In (Active)</option>
              <option value="confirmed">Confirmed (Upcoming)</option>
              <option value="checked_out">Checked Out</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${isDark ? 'border-white/10 text-gray-400' : 'border-slate-200 text-slate-500'}`}>
                <th className="py-3 px-3 font-semibold">Booking ID</th>
                <th className="py-3 px-3 font-semibold">Guest & Contact</th>
                <th className="py-3 px-3 font-semibold">Unit / Room</th>
                <th className="py-3 px-3 font-semibold">Stay Dates</th>
                <th className="py-3 px-3 font-semibold">Source</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold">Folio Total</th>
                <th className="py-3 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-orange-400">{b.id}</td>

                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{b.guestName}</div>
                    <div className="text-[11px] text-gray-400">{b.guestPhone}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-semibold text-gray-200">{b.unitName}</span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="text-gray-300">
                      {b.checkInDate} &rarr; {b.checkOutDate}
                    </div>
                    <div className="text-[10px] text-gray-500">{b.numberOfNights} Nights</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.source === 'makemytrip'
                        ? 'bg-red-500/20 text-red-300'
                        : b.source === 'goibibo'
                        ? 'bg-orange-500/20 text-orange-300'
                        : b.source === 'airbnb'
                        ? 'bg-pink-500/20 text-pink-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {b.source.toUpperCase()}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      b.status === 'checked_in'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : b.status === 'confirmed'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        : 'bg-gray-500/10 text-gray-400 border border-gray-500/30'
                    }`}>
                      {b.status.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-black text-white">
                    ₹{b.taxBreakdown.grandTotal.toLocaleString('en-IN')}
                    {b.addonCharges.length > 0 && (
                      <span className="block text-[10px] text-orange-400 font-normal">
                        +{b.addonCharges.length} Add-on items
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Add service button */}
                      <button
                        onClick={() => setEditingBookingForAddons(b)}
                        className="px-2 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 font-semibold text-[11px] flex items-center gap-1"
                        title="Add Food, Laundry or Upgrade"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Charge</span>
                      </button>

                      {/* Download Receipt */}
                      <button
                        onClick={() => onOpenReceiptModal(b, 'receipt')}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                        title="Official Tax Invoice / Receipt"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                      </button>

                      {/* Download Quotation */}
                      <button
                        onClick={() => onOpenReceiptModal(b, 'quotation')}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                        title="Pro-forma Quotation"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD CHARGES MODAL FOR EXISTING STAY */}
      {editingBookingForAddons && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl relative ${
            isDark ? 'bg-[#0E1017] border-orange-500/40 text-white' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <button
              onClick={() => setEditingBookingForAddons(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <UtensilsCrossed className="w-4 h-4 text-orange-400" />
              <h3 className="font-bold text-base">Add Charges to Guest Folio</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Guest: <strong>{editingBookingForAddons.guestName}</strong> ({editingBookingForAddons.unitName})
            </p>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Service Category</label>
                <select
                  value={customAddonCategory}
                  onChange={(e) => setCustomAddonCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-orange-500"
                >
                  <option value="food">Food & Restaurant / Room Service (5% GST)</option>
                  <option value="laundry">Laundry & Dry Cleaning (18% GST)</option>
                  <option value="room_upgrade">Room Upgrade / Extra Bed (18% GST)</option>
                  <option value="transport">Cab / Airport Transfer (18% GST)</option>
                  <option value="amenity">Spa & Wellness / Bonfire (18% GST)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Description / Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. 2x Masala Dosa & Filter Coffee"
                  value={customAddonName}
                  onChange={(e) => setCustomAddonName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={customAddonQty}
                    onChange={(e) => setCustomAddonQty(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    min={10}
                    value={customAddonPrice}
                    onChange={(e) => setCustomAddonPrice(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center text-xs">
                <span>Total Charge + GST:</span>
                <span className="font-bold text-orange-400 text-sm">
                  ₹{Math.round((customAddonQty * customAddonPrice) * (1 + (customAddonCategory === 'food' ? 0.05 : 0.18)))}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBookingForAddons(null)}
                  className="px-3 py-2 rounded-xl text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddChargeToExistingStay}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold"
                >
                  Append to Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
