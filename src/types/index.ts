export type PropertyType = 'hotel' | 'villa' | 'airbnb';

export type PlanType = 'starter' | 'pro' | 'enterprise';

export type ClientStatus = 'active' | 'trial' | 'suspended';

export type BookingSource =
  | 'walkin'
  | 'phone'
  | 'goibibo'
  | 'makemytrip'
  | 'airbnb'
  | 'booking_com'
  | 'agoda'
  | 'direct';

export type BookingStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';

export type UnitStatus = 'available' | 'occupied' | 'dirty' | 'reserved';

export interface Unit {
  id: string;
  propertyId: string;
  name: string; // e.g. "Room 101", "Sunset Villa 3BHK", "Penthouse Suite"
  category: string; // "Deluxe Room", "Presidential Suite", "3BHK Private Villa"
  floor?: number;
  basePrice: number;
  maxOccupancy: number;
  amenities: string[];
  currentStatus: UnitStatus;
  currentBookingId?: string;
}

export interface AddonCharge {
  id: string;
  category: 'food' | 'laundry' | 'room_upgrade' | 'amenity' | 'transport';
  name: string;
  quantity: number;
  unitPrice: number;
  gstRatePercent: number; // e.g. 5 for food, 18 for laundry/services
  addedAt: string;
}

export interface TaxBreakdown {
  roomSubtotal: number;
  roomGst: number; // 12% if <= 7500, 18% if > 7500 per day
  roomGstRate: number;
  addonSubtotal: number;
  addonGst: number;
  cgst: number;
  sgst: number;
  totalGst: number;
  grandTotal: number;
}

export interface Booking {
  id: string;
  propertyId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  idProofType: 'Aadhaar' | 'Passport' | 'Driving License' | 'Voter ID';
  idProofNumber: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  unitId: string;
  unitName: string;
  source: BookingSource;
  status: BookingStatus;
  guestsCount: { adults: number; children: number };
  baseTariffPerNight: number;
  numberOfNights: number;
  addonCharges: AddonCharge[];
  paymentStatus: 'paid' | 'partial' | 'pending';
  paymentMethod: 'upi' | 'card' | 'cash' | 'ota_virtual_card' | 'bank_transfer';
  taxBreakdown: TaxBreakdown;
  paidAmount: number;
  createdAt: string;
  notes?: string;
}

export interface DynamicPricingSettings {
  baseMultiplier: number; // 1.0 default
  weekendSurgePercent: number; // e.g. 20%
  highDemandSurgePercent: number; // e.g. 35%
  seasonFactorPercent: number; // e.g. 15%
  manualDateOverrides: Record<string, number>; // date -> price
}

export interface SyncedOTAs {
  goibibo: boolean;
  makeMyTrip: boolean;
  airbnb: boolean;
  bookingCom: boolean;
  agoda: boolean;
}

export interface ClientProperty {
  id: string;
  name: string;
  type: PropertyType;
  ownerName: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  state: string;
  unitsCount: number;
  plan: PlanType;
  status: ClientStatus;
  paymentStatus: 'paid' | 'pending';
  joinedAt: string;
  syncedOTAs: SyncedOTAs;
  units: Unit[];
  dynamicPricing: DynamicPricingSettings;
  taxDetails: {
    gstin?: string;
    tradeName?: string;
    address?: string;
  };
}

export interface OTASyncLog {
  id: string;
  propertyId: string;
  channel: 'MakeMyTrip' | 'Goibibo' | 'Airbnb' | 'Booking.com' | 'Agoda';
  action: 'incoming_booking' | 'inventory_blocked' | 'price_synced' | 'sync_verified';
  timestamp: string;
  status: 'synced' | 'conflict_prevented' | 'alert';
  details: string;
  unitName?: string;
}

export type UserRole = 'guest' | 'admin' | 'client';

export interface AuthSession {
  role: UserRole;
  email: string;
  clientPropertyId?: string;
}

export interface GSTSummaryItem {
  period: string; // e.g., "Nov 2026" or "FY 2026-27"
  totalBookings: number;
  grossRevenue: number;
  roomTurnover: number;
  roomGst12Turnover: number;
  roomGst18Turnover: number;
  foodTurnover: number;
  laundryTurnover: number;
  cgst: number;
  sgst: number;
  totalGst: number;
  netTurnover: number;
}
