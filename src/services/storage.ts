import {
  AddonCharge,
  AuthSession,
  Booking,
  ClientProperty,
  GSTSummaryItem,
  OTASyncLog,
  TaxBreakdown,
  Unit,
} from '../types';

const STORAGE_KEYS = {
  CLIENTS: 'aurastay_clients_v1',
  BOOKINGS: 'aurastay_bookings_v1',
  SYNC_LOGS: 'aurastay_sync_logs_v1',
  AUTH: 'aurastay_auth_v1',
  THEME: 'aurastay_theme_v1',
};

// Realistic mock seed data
const SEED_CLIENTS: ClientProperty[] = [
  {
    id: 'prop-hotel-01',
    name: 'The Grand Amber Palace & Resort',
    type: 'hotel',
    ownerName: 'Renuka Sridhar',
    email: 'amber.palace@aurastay.com',
    password: 'password123',
    phone: '+91 98450 12345',
    city: 'Jaipur',
    state: 'Rajasthan',
    unitsCount: 12,
    plan: 'enterprise',
    status: 'active',
    paymentStatus: 'paid',
    joinedAt: '2026-08-15',
    syncedOTAs: {
      goibibo: true,
      makeMyTrip: true,
      airbnb: false,
      bookingCom: true,
      agoda: true,
    },
    taxDetails: {
      gstin: '08AAAAA0000A1Z5',
      tradeName: 'The Grand Amber Palace Hospitality LLP',
      address: 'Amer Road, Opp Heritage Gate, Jaipur, Rajasthan 302002',
    },
    dynamicPricing: {
      baseMultiplier: 1.0,
      weekendSurgePercent: 25,
      highDemandSurgePercent: 40,
      seasonFactorPercent: 20,
      manualDateOverrides: {},
    },
    units: [
      { id: 'u-101', propertyId: 'prop-hotel-01', name: 'Room 101', category: 'Deluxe Heritage Room', floor: 1, basePrice: 4800, maxOccupancy: 3, amenities: ['King Bed', 'Heritage Courtyard View', 'High-Speed Wi-Fi', 'Smart TV', 'Bathtub'], currentStatus: 'occupied' },
      { id: 'u-102', propertyId: 'prop-hotel-01', name: 'Room 102', category: 'Deluxe Heritage Room', floor: 1, basePrice: 4800, maxOccupancy: 3, amenities: ['Twin Beds', 'Courtyard View', 'Wi-Fi', 'Mini Bar'], currentStatus: 'available' },
      { id: 'u-103', propertyId: 'prop-hotel-01', name: 'Room 103', category: 'Executive Palace Room', floor: 1, basePrice: 6500, maxOccupancy: 3, amenities: ['King Bed', 'Garden View', 'Work Desk', 'Nespresso'], currentStatus: 'reserved' },
      { id: 'u-104', propertyId: 'prop-hotel-01', name: 'Room 104', category: 'Executive Palace Room', floor: 1, basePrice: 6500, maxOccupancy: 3, amenities: ['King Bed', 'Balcony', 'Safe', 'Rain Shower'], currentStatus: 'available' },
      { id: 'u-201', propertyId: 'prop-hotel-01', name: 'Room 201', category: 'Royal Fort Suite', floor: 2, basePrice: 11500, maxOccupancy: 4, amenities: ['Private Terrace', 'Fort View', 'Butler Service', 'Jacuzzi'], currentStatus: 'occupied' },
      { id: 'u-202', propertyId: 'prop-hotel-01', name: 'Room 202', category: 'Royal Fort Suite', floor: 2, basePrice: 11500, maxOccupancy: 4, amenities: ['Plunge Pool', 'Living Room', 'Chandelier', 'Walk-in Closet'], currentStatus: 'available' },
      { id: 'u-203', propertyId: 'prop-hotel-01', name: 'Room 203', category: 'Deluxe Heritage Room', floor: 2, basePrice: 5200, maxOccupancy: 3, amenities: ['Queen Bed', 'Pool View', 'Smart TV'], currentStatus: 'dirty' },
      { id: 'u-204', propertyId: 'prop-hotel-01', name: 'Room 204', category: 'Executive Palace Room', floor: 2, basePrice: 6800, maxOccupancy: 3, amenities: ['King Bed', 'Pool View', 'Sound Bar'], currentStatus: 'available' },
      { id: 'u-301', propertyId: 'prop-hotel-01', name: 'Room 301 (Maharaja Suite)', category: 'Presidential Suite', floor: 3, basePrice: 18500, maxOccupancy: 5, amenities: ['Panoramic Skyline', 'Private Dining', 'Gold-plated fittings', 'Personal Chef'], currentStatus: 'occupied' },
      { id: 'u-302', propertyId: 'prop-hotel-01', name: 'Room 302', category: 'Executive Palace Room', floor: 3, basePrice: 7200, maxOccupancy: 3, amenities: ['King Bed', 'Sunset Balcony', 'Bathtub'], currentStatus: 'available' },
      { id: 'u-303', propertyId: 'prop-hotel-01', name: 'Room 303', category: 'Deluxe Heritage Room', floor: 3, basePrice: 5200, maxOccupancy: 3, amenities: ['King Bed', 'Wi-Fi', 'Room Service'], currentStatus: 'available' },
      { id: 'u-304', propertyId: 'prop-hotel-01', name: 'Room 304', category: 'Deluxe Heritage Room', floor: 3, basePrice: 5200, maxOccupancy: 3, amenities: ['Twin Beds', 'Garden View', 'Tea Maker'], currentStatus: 'available' },
    ],
  },
  {
    id: 'prop-villa-02',
    name: 'Casa Solara Luxury Private Pool Villa',
    type: 'villa',
    ownerName: 'Vikram & Aisha Mehta',
    email: 'casasolara.goa@aurastay.com',
    password: 'password123',
    phone: '+91 97230 45678',
    city: 'Anjuna, Goa',
    state: 'Goa',
    unitsCount: 1,
    plan: 'pro',
    status: 'active',
    paymentStatus: 'paid',
    joinedAt: '2026-09-01',
    syncedOTAs: {
      goibibo: true,
      makeMyTrip: true,
      airbnb: true,
      bookingCom: true,
      agoda: false,
    },
    taxDetails: {
      gstin: '30BBBBB1111B2Z6',
      tradeName: 'Casa Solara Villa Estates',
      address: 'House 42, St. Anthony Praise, Anjuna Beach Rd, Goa 403509',
    },
    dynamicPricing: {
      baseMultiplier: 1.0,
      weekendSurgePercent: 35,
      highDemandSurgePercent: 50,
      seasonFactorPercent: 30,
      manualDateOverrides: {},
    },
    units: [
      {
        id: 'u-villa-entire',
        propertyId: 'prop-villa-02',
        name: 'Entire 4BHK Infinity Pool Villa',
        category: 'Private Luxury Villa',
        basePrice: 28000,
        maxOccupancy: 12,
        amenities: ['Private Infinity Pool', '4 Ensuite Bedrooms', 'Private Butler', 'BBQ Deck', 'High-Fidelity Sonance Audio', 'Lush Tropical Garden'],
        currentStatus: 'occupied',
      },
    ],
  },
  {
    id: 'prop-airbnb-03',
    name: 'Whispering Pines Alpine Chalet',
    type: 'airbnb',
    ownerName: 'Kabir Oberoi',
    email: 'manali.chalet@aurastay.com',
    password: 'password123',
    phone: '+91 94180 88990',
    city: 'Old Manali',
    state: 'Himachal Pradesh',
    unitsCount: 2,
    plan: 'starter',
    status: 'active',
    paymentStatus: 'paid',
    joinedAt: '2026-10-10',
    syncedOTAs: {
      goibibo: false,
      makeMyTrip: true,
      airbnb: true,
      bookingCom: false,
      agoda: false,
    },
    taxDetails: {
      gstin: '02CCCCC2222C3Z7',
      tradeName: 'Whispering Pines Stays',
      address: 'Club House Road, Old Manali, HP 175131',
    },
    dynamicPricing: {
      baseMultiplier: 1.0,
      weekendSurgePercent: 20,
      highDemandSurgePercent: 40,
      seasonFactorPercent: 25,
      manualDateOverrides: {},
    },
    units: [
      { id: 'u-chalet-loft', propertyId: 'prop-airbnb-03', name: 'The Cedar Loft Suite', category: 'Penthouse Attic Studio', basePrice: 6200, maxOccupancy: 4, amenities: ['Glass Roof Stargazing', 'Cedar Wood Fireplace', 'Espresso Bar', 'Snow Peak Views'], currentStatus: 'available' },
      { id: 'u-chalet-cottage', propertyId: 'prop-airbnb-03', name: 'Meadow Brook Wood Cabin', category: '2BHK Cabin', basePrice: 8500, maxOccupancy: 6, amenities: ['Private Brook Access', 'Woodfire Stove', 'Kitchenette', 'High-Speed Starlink Wi-Fi'], currentStatus: 'occupied' },
    ],
  },
];

// Helper to format dates relative to current date (Nov 2026)
const getTodayStr = () => '2026-11-01';
const getTomorrowStr = () => '2026-11-02';
const getDayAfterStr = () => '2026-11-03';
const getYesterdayStr = () => '2026-10-31';

export function calculateTaxes(
  tariffPerNight: number,
  numberOfNights: number,
  addonCharges: AddonCharge[] = []
): TaxBreakdown {
  const roomSubtotal = tariffPerNight * numberOfNights;
  // Indian Hospitality GST slab rule:
  // Room tariff per day <= 7500 -> 12% GST
  // Room tariff per day > 7500 -> 18% GST
  const roomGstRate = tariffPerNight <= 7500 ? 0.12 : 0.18;
  const roomGst = Math.round(roomSubtotal * roomGstRate);

  let addonSubtotal = 0;
  let addonGst = 0;

  addonCharges.forEach((item) => {
    const itemTotal = item.quantity * item.unitPrice;
    addonSubtotal += itemTotal;
    const itemGst = Math.round(itemTotal * (item.gstRatePercent / 100));
    addonGst += itemGst;
  });

  const totalGst = roomGst + addonGst;
  const cgst = Math.round(totalGst / 2);
  const sgst = totalGst - cgst;
  const grandTotal = roomSubtotal + addonSubtotal + totalGst;

  return {
    roomSubtotal,
    roomGst,
    roomGstRate: roomGstRate * 100,
    addonSubtotal,
    addonGst,
    cgst,
    sgst,
    totalGst,
    grandTotal,
  };
}

const SEED_BOOKINGS: Booking[] = [
  // Hotel bookings
  {
    id: 'BK-78401',
    propertyId: 'prop-hotel-01',
    guestName: 'Dr. Siddharth Rao',
    guestEmail: 'siddharth.rao@example.com',
    guestPhone: '+91 98840 99887',
    idProofType: 'Aadhaar',
    idProofNumber: '8940-1283-9912',
    checkInDate: '2026-10-30',
    checkOutDate: '2026-11-02',
    unitId: 'u-101',
    unitName: 'Room 101',
    source: 'makemytrip',
    status: 'checked_in',
    guestsCount: { adults: 2, children: 0 },
    baseTariffPerNight: 4800,
    numberOfNights: 3,
    addonCharges: [
      { id: 'ad-1', category: 'food', name: 'Royal Rajasthani Thali (2)', quantity: 2, unitPrice: 750, gstRatePercent: 5, addedAt: '2026-10-31 20:30' },
      { id: 'ad-2', category: 'laundry', name: 'Suit Dry Clean & Press', quantity: 2, unitPrice: 400, gstRatePercent: 18, addedAt: '2026-10-31 10:00' },
    ],
    paymentStatus: 'paid',
    paymentMethod: 'ota_virtual_card',
    taxBreakdown: {
      roomSubtotal: 14400,
      roomGst: 1728,
      roomGstRate: 12,
      addonSubtotal: 2300,
      addonGst: 219,
      cgst: 974,
      sgst: 973,
      totalGst: 1947,
      grandTotal: 18647,
    },
    paidAmount: 18647,
    createdAt: '2026-10-25 14:12',
    notes: 'Guest requested extra pillows and late check-out on Nov 2nd.',
  },
  {
    id: 'BK-78402',
    propertyId: 'prop-hotel-01',
    guestName: 'Ananya & Rohan Deshmukh',
    guestEmail: 'ananya.d@example.com',
    guestPhone: '+91 97654 32109',
    idProofType: 'Passport',
    idProofNumber: 'Z8931045',
    checkInDate: '2026-10-31',
    checkOutDate: '2026-11-03',
    unitId: 'u-201',
    unitName: 'Room 201 (Royal Fort Suite)',
    source: 'goibibo',
    status: 'checked_in',
    guestsCount: { adults: 2, children: 1 },
    baseTariffPerNight: 11500,
    numberOfNights: 3,
    addonCharges: [
      { id: 'ad-3', category: 'food', name: 'Champagne & Fruit Platter', quantity: 1, unitPrice: 3200, gstRatePercent: 5, addedAt: '2026-10-31 16:00' },
      { id: 'ad-4', category: 'room_upgrade', name: 'Fort View Sunset Terrace Setup', quantity: 1, unitPrice: 2500, gstRatePercent: 18, addedAt: '2026-11-01 09:30' },
      { id: 'ad-5', category: 'transport', name: 'Luxury Airport Drop (Audi A6)', quantity: 1, unitPrice: 3500, gstRatePercent: 18, addedAt: '2026-11-01 11:00' },
    ],
    paymentStatus: 'paid',
    paymentMethod: 'card',
    taxBreakdown: {
      roomSubtotal: 34500,
      roomGst: 6210,
      roomGstRate: 18,
      addonSubtotal: 9200,
      addonGst: 1240,
      cgst: 3725,
      sgst: 3725,
      totalGst: 7450,
      grandTotal: 51150,
    },
    paidAmount: 51150,
    createdAt: '2026-10-28 11:20',
    notes: 'Honeymoon couple. Provided complimentary cake.',
  },
  {
    id: 'BK-78403',
    propertyId: 'prop-hotel-01',
    guestName: 'Vikramaditya Singhania',
    guestEmail: 'vikram.singhania@corp.in',
    guestPhone: '+91 99001 54321',
    idProofType: 'Aadhaar',
    idProofNumber: '7821-4321-9988',
    checkInDate: '2026-11-01',
    checkOutDate: '2026-11-04',
    unitId: 'u-301',
    unitName: 'Room 301 (Maharaja Suite)',
    source: 'walkin',
    status: 'checked_in',
    guestsCount: { adults: 2, children: 0 },
    baseTariffPerNight: 18500,
    numberOfNights: 3,
    addonCharges: [
      { id: 'ad-6', category: 'food', name: 'Private Butler Dinner Buffet', quantity: 2, unitPrice: 2200, gstRatePercent: 5, addedAt: '2026-11-01 13:00' },
    ],
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    taxBreakdown: {
      roomSubtotal: 55500,
      roomGst: 9990,
      roomGstRate: 18,
      addonSubtotal: 4400,
      addonGst: 220,
      cgst: 5105,
      sgst: 5105,
      totalGst: 10210,
      grandTotal: 70110,
    },
    paidAmount: 70110,
    createdAt: '2026-11-01 10:15',
    notes: 'Walk-in VIP client. Immediate check-in with receipt issued.',
  },
  // Upcoming bookings for next 2 days
  {
    id: 'BK-78404',
    propertyId: 'prop-hotel-01',
    guestName: 'Meera Nambiar',
    guestEmail: 'meera.nambiar@tech.co',
    guestPhone: '+91 94471 22334',
    idProofType: 'Aadhaar',
    idProofNumber: '5544-3322-1100',
    checkInDate: '2026-11-02',
    checkOutDate: '2026-11-04',
    unitId: 'u-103',
    unitName: 'Room 103 (Executive Palace Room)',
    source: 'makemytrip',
    status: 'confirmed',
    guestsCount: { adults: 1, children: 0 },
    baseTariffPerNight: 6500,
    numberOfNights: 2,
    addonCharges: [],
    paymentStatus: 'paid',
    paymentMethod: 'ota_virtual_card',
    taxBreakdown: {
      roomSubtotal: 13000,
      roomGst: 1560,
      roomGstRate: 12,
      addonSubtotal: 0,
      addonGst: 0,
      cgst: 780,
      sgst: 780,
      totalGst: 1560,
      grandTotal: 14560,
    },
    paidAmount: 14560,
    createdAt: '2026-10-29 09:10',
    notes: 'Early check-in requested at 11 AM.',
  },
  {
    id: 'BK-78405',
    propertyId: 'prop-hotel-01',
    guestName: 'Tanya & Rajesh Kapoor',
    guestEmail: 'rajesh.kapoor@global.com',
    guestPhone: '+91 98112 77665',
    idProofType: 'Passport',
    idProofNumber: 'K4419208',
    checkInDate: '2026-11-03',
    checkOutDate: '2026-11-06',
    unitId: 'u-104',
    unitName: 'Room 104 (Executive Palace Room)',
    source: 'booking_com',
    status: 'confirmed',
    guestsCount: { adults: 2, children: 1 },
    baseTariffPerNight: 6800,
    numberOfNights: 3,
    addonCharges: [],
    paymentStatus: 'pending',
    paymentMethod: 'card',
    taxBreakdown: {
      roomSubtotal: 20400,
      roomGst: 2448,
      roomGstRate: 12,
      addonSubtotal: 0,
      addonGst: 0,
      cgst: 1224,
      sgst: 1224,
      totalGst: 2448,
      grandTotal: 22848,
    },
    paidAmount: 0,
    createdAt: '2026-10-31 18:45',
    notes: 'Payment upon arrival requested. Credit card guaranteed.',
  },
  // Villa booking
  {
    id: 'BK-99101',
    propertyId: 'prop-villa-02',
    guestName: 'Zoya Merchant & Friends',
    guestEmail: 'zoya.m@style.in',
    guestPhone: '+91 98200 44556',
    idProofType: 'Aadhaar',
    idProofNumber: '9922-3344-5566',
    checkInDate: '2026-10-29',
    checkOutDate: '2026-11-02',
    unitId: 'u-villa-entire',
    unitName: 'Entire 4BHK Infinity Pool Villa',
    source: 'airbnb',
    status: 'checked_in',
    guestsCount: { adults: 8, children: 0 },
    baseTariffPerNight: 28000,
    numberOfNights: 4,
    addonCharges: [
      { id: 'ad-v1', category: 'food', name: 'Private Villa Chef BBQ Night', quantity: 1, unitPrice: 8500, gstRatePercent: 5, addedAt: '2026-10-30 19:00' },
      { id: 'ad-v2', category: 'amenity', name: 'Poolside Cabana Cocktail Service', quantity: 1, unitPrice: 4500, gstRatePercent: 18, addedAt: '2026-10-31 17:00' },
    ],
    paymentStatus: 'paid',
    paymentMethod: 'card',
    taxBreakdown: {
      roomSubtotal: 112000,
      roomGst: 20160,
      roomGstRate: 18,
      addonSubtotal: 13000,
      addonGst: 1235,
      cgst: 10698,
      sgst: 10697,
      totalGst: 21395,
      grandTotal: 146395,
    },
    paidAmount: 146395,
    createdAt: '2026-10-15 12:00',
    notes: 'Security deposit of 20k held. No loud music post 10 PM.',
  },
  // Airbnb chalet booking
  {
    id: 'BK-55201',
    propertyId: 'prop-airbnb-03',
    guestName: 'Arjun & Maya Sharma',
    guestEmail: 'arjun.sharma@trek.org',
    guestPhone: '+91 97110 99887',
    idProofType: 'Aadhaar',
    idProofNumber: '4455-6677-8899',
    checkInDate: '2026-10-31',
    checkOutDate: '2026-11-03',
    unitId: 'u-chalet-cottage',
    unitName: 'Meadow Brook Wood Cabin',
    source: 'airbnb',
    status: 'checked_in',
    guestsCount: { adults: 4, children: 0 },
    baseTariffPerNight: 8500,
    numberOfNights: 3,
    addonCharges: [
      { id: 'ad-c1', category: 'amenity', name: 'Firewood & Bonfire Night Bundle', quantity: 2, unitPrice: 800, gstRatePercent: 18, addedAt: '2026-10-31 18:30' },
    ],
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    taxBreakdown: {
      roomSubtotal: 25500,
      roomGst: 4590,
      roomGstRate: 18,
      addonSubtotal: 1600,
      addonGst: 288,
      cgst: 2439,
      sgst: 2439,
      totalGst: 4878,
      grandTotal: 31978,
    },
    paidAmount: 31978,
    createdAt: '2026-10-20 16:30',
  },
];

const SEED_SYNC_LOGS: OTASyncLog[] = [
  {
    id: 'sync-1',
    propertyId: 'prop-hotel-01',
    channel: 'MakeMyTrip',
    action: 'inventory_blocked',
    timestamp: '2026-11-01 10:16:04',
    status: 'synced',
    details: 'Offline walk-in for Room 301 locked. Available count decreased on MakeMyTrip OTA Extranet.',
    unitName: 'Room 301',
  },
  {
    id: 'sync-2',
    propertyId: 'prop-hotel-01',
    channel: 'Goibibo',
    action: 'inventory_blocked',
    timestamp: '2026-11-01 10:16:05',
    status: 'synced',
    details: 'Instant 2-way lock pushed to Goibibo API (Response: 200 OK, 142ms latency).',
    unitName: 'Room 301',
  },
  {
    id: 'sync-3',
    propertyId: 'prop-hotel-01',
    channel: 'Booking.com',
    action: 'sync_verified',
    timestamp: '2026-11-01 09:30:12',
    status: 'synced',
    details: 'Daily ARI (Availability, Rates & Inventory) batch verified across 12 room keys.',
  },
  {
    id: 'sync-4',
    propertyId: 'prop-villa-02',
    channel: 'Airbnb',
    action: 'inventory_blocked',
    timestamp: '2026-10-29 12:05:00',
    status: 'synced',
    details: 'Airbnb iCal & API webhook processed: Blocked Oct 29 - Nov 02 on Goibibo and MMT.',
    unitName: 'Entire 4BHK Villa',
  },
  {
    id: 'sync-5',
    propertyId: 'prop-hotel-01',
    channel: 'Goibibo',
    action: 'incoming_booking',
    timestamp: '2026-10-31 16:02:11',
    status: 'synced',
    details: 'New reservation BK-78402 ingested via Goibibo Webhook for Room 201.',
    unitName: 'Room 201',
  },
];

export const storage = {
  getClients(): ClientProperty[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(SEED_CLIENTS));
      return SEED_CLIENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_CLIENTS;
    }
  },

  saveClients(clients: ClientProperty[]): void {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  },

  getClientById(id: string): ClientProperty | undefined {
    return this.getClients().find((c) => c.id === id);
  },

  getClientByEmail(email: string): ClientProperty | undefined {
    const normalized = email.trim().toLowerCase();
    return this.getClients().find((c) => c.email.trim().toLowerCase() === normalized);
  },

  addClient(newClient: ClientProperty): void {
    const clients = this.getClients();
    clients.unshift(newClient);
    this.saveClients(clients);
  },

  updateClient(updated: ClientProperty): void {
    const clients = this.getClients().map((c) => (c.id === updated.id ? updated : c));
    this.saveClients(clients);
  },

  // Bookings
  getBookings(): Booking[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(SEED_BOOKINGS));
      return SEED_BOOKINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_BOOKINGS;
    }
  },

  saveBookings(bookings: Booking[]): void {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  },

  getPropertyBookings(propertyId: string): Booking[] {
    return this.getBookings().filter((b) => b.propertyId === propertyId);
  },

  getBookingById(id: string): Booking | undefined {
    return this.getBookings().find((b) => b.id === id);
  },

  createBooking(booking: Booking): void {
    const bookings = this.getBookings();
    bookings.unshift(booking);
    this.saveBookings(bookings);

    // Update unit status to occupied/reserved
    const clients = this.getClients();
    const client = clients.find((c) => c.id === booking.propertyId);
    if (client) {
      client.units = client.units.map((u) => {
        if (u.id === booking.unitId) {
          return { ...u, currentStatus: booking.status === 'checked_in' ? 'occupied' : 'reserved', currentBookingId: booking.id };
        }
        return u;
      });
      this.saveClients(clients);

      // Trigger automatic OTA Real-Time sync
      this.dispatchOTABlock(client, booking);
    }
  },

  updateBooking(updated: Booking): void {
    const bookings = this.getBookings().map((b) => (b.id === updated.id ? updated : b));
    this.saveBookings(bookings);

    // If checked out or cancelled, free the unit
    if (updated.status === 'checked_out' || updated.status === 'cancelled') {
      const clients = this.getClients();
      const client = clients.find((c) => c.id === updated.propertyId);
      if (client) {
        client.units = client.units.map((u) => {
          if (u.id === updated.unitId) {
            return { ...u, currentStatus: 'available', currentBookingId: undefined };
          }
          return u;
        });
        this.saveClients(clients);
      }
    }
  },

  // Real-time OTA synchronization dispatch
  dispatchOTABlock(client: ClientProperty, booking: Booking): void {
    const channels: ('MakeMyTrip' | 'Goibibo' | 'Airbnb' | 'Booking.com')[] = [];
    if (client.syncedOTAs.makeMyTrip) channels.push('MakeMyTrip');
    if (client.syncedOTAs.goibibo) channels.push('Goibibo');
    if (client.syncedOTAs.airbnb) channels.push('Airbnb');
    if (client.syncedOTAs.bookingCom) channels.push('Booking.com');

    const logs = this.getSyncLogs();
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    channels.forEach((ch, idx) => {
      logs.unshift({
        id: 'sync-' + Date.now() + '-' + idx,
        propertyId: client.id,
        channel: ch,
        action: 'inventory_blocked',
        timestamp: now,
        status: 'synced',
        details: `Real-time 2-way sync: Offline booking for ${booking.unitName} (${booking.guestName}) pushed. Inventory blocked to prevent overbooking.`,
        unitName: booking.unitName,
      });
    });

    this.saveSyncLogs(logs.slice(0, 50));
  },

  simulateIncomingOTABooking(propertyId: string, channel: 'MakeMyTrip' | 'Goibibo' | 'Airbnb' = 'MakeMyTrip'): Booking | null {
    const clients = this.getClients();
    const client = clients.find((c) => c.id === propertyId);
    if (!client) return null;

    const availableUnit = client.units.find((u) => u.currentStatus === 'available');
    if (!availableUnit) return null;

    const demoGuests = [
      { name: 'Priya Sundaram', email: 'priya.s@travel.com', phone: '+91 98334 11223' },
      { name: 'Kunal Kapoor', email: 'kunal.k@venture.in', phone: '+91 97112 33445' },
      { name: 'Shreya Sen', email: 'shreya.sen@design.co', phone: '+91 98450 66778' },
    ];
    const guest = demoGuests[Math.floor(Math.random() * demoGuests.length)];
    const newId = 'BK-OTA-' + Math.floor(10000 + Math.random() * 90000);

    const taxes = calculateTaxes(availableUnit.basePrice, 2, []);
    const newBooking: Booking = {
      id: newId,
      propertyId: client.id,
      guestName: guest.name,
      guestEmail: guest.email,
      guestPhone: guest.phone,
      idProofType: 'Passport',
      idProofNumber: 'P' + Math.floor(1000000 + Math.random() * 9000000),
      checkInDate: getTodayStr(),
      checkOutDate: getDayAfterStr(),
      unitId: availableUnit.id,
      unitName: availableUnit.name,
      source: channel === 'MakeMyTrip' ? 'makemytrip' : channel === 'Goibibo' ? 'goibibo' : 'airbnb',
      status: 'confirmed',
      guestsCount: { adults: 2, children: 0 },
      baseTariffPerNight: availableUnit.basePrice,
      numberOfNights: 2,
      addonCharges: [],
      paymentStatus: 'paid',
      paymentMethod: 'ota_virtual_card',
      taxBreakdown: taxes,
      paidAmount: taxes.grandTotal,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      notes: `Automated instant reservation imported from ${channel} API.`,
    };

    // Update unit
    availableUnit.currentStatus = 'reserved';
    availableUnit.currentBookingId = newId;
    this.saveClients(clients);

    const bookings = this.getBookings();
    bookings.unshift(newBooking);
    this.saveBookings(bookings);

    // Sync log
    const logs = this.getSyncLogs();
    logs.unshift({
      id: 'sync-' + Date.now(),
      propertyId: client.id,
      channel: channel,
      action: 'incoming_booking',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'synced',
      details: `Incoming reservation ${newId} ingested via ${channel} webhook. Room ${availableUnit.name} locked across all channels.`,
      unitName: availableUnit.name,
    });
    this.saveSyncLogs(logs.slice(0, 50));

    return newBooking;
  },

  // Sync logs
  getSyncLogs(): OTASyncLog[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SYNC_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SYNC_LOGS, JSON.stringify(SEED_SYNC_LOGS));
      return SEED_SYNC_LOGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_SYNC_LOGS;
    }
  },

  saveSyncLogs(logs: OTASyncLog[]): void {
    localStorage.setItem(STORAGE_KEYS.SYNC_LOGS, JSON.stringify(logs));
  },

  // Auth session
  getAuth(): AuthSession | null {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setAuth(session: AuthSession | null): void {
    if (!session) {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } else {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session));
    }
  },

  // Theme
  getTheme(): 'dark' | 'light' {
    const raw = localStorage.getItem(STORAGE_KEYS.THEME);
    return raw === 'light' ? 'light' : 'dark'; // default to vibrant dark neonic theme
  },

  setTheme(theme: 'dark' | 'light'): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  // GST Calculation Reports
  getGSTSummary(propertyId: string, year = 2026, month = 11): GSTSummaryItem {
    const bookings = this.getPropertyBookings(propertyId);
    const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;

    const monthBookings = bookings.filter((b) => {
      return b.paymentStatus === 'paid' && (b.checkInDate.startsWith(monthPrefix) || b.createdAt.startsWith(monthPrefix));
    });

    let roomGst12Turnover = 0;
    let roomGst18Turnover = 0;
    let foodTurnover = 0;
    let laundryTurnover = 0;
    let cgst = 0;
    let sgst = 0;
    let totalGst = 0;
    let grossRevenue = 0;

    monthBookings.forEach((b) => {
      grossRevenue += b.taxBreakdown.grandTotal;
      totalGst += b.taxBreakdown.totalGst;
      cgst += b.taxBreakdown.cgst;
      sgst += b.taxBreakdown.sgst;

      if (b.taxBreakdown.roomGstRate === 12) {
        roomGst12Turnover += b.taxBreakdown.roomSubtotal;
      } else {
        roomGst18Turnover += b.taxBreakdown.roomSubtotal;
      }

      b.addonCharges.forEach((ad) => {
        const itemTot = ad.quantity * ad.unitPrice;
        if (ad.category === 'food') {
          foodTurnover += itemTot;
        } else {
          laundryTurnover += itemTot;
        }
      });
    });

    const roomTurnover = roomGst12Turnover + roomGst18Turnover;
    const netTurnover = roomTurnover + foodTurnover + laundryTurnover;

    return {
      period: `${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`,
      totalBookings: monthBookings.length,
      grossRevenue,
      roomTurnover,
      roomGst12Turnover,
      roomGst18Turnover,
      foodTurnover,
      laundryTurnover,
      cgst,
      sgst,
      totalGst,
      netTurnover,
    };
  },

  getAnnualGSTSummary(propertyId: string, financialYear = '2026-27'): GSTSummaryItem {
    const bookings = this.getPropertyBookings(propertyId);
    let grossRevenue = 0;
    let totalGst = 0;
    let cgst = 0;
    let sgst = 0;
    let roomGst12Turnover = 0;
    let roomGst18Turnover = 0;
    let foodTurnover = 0;
    let laundryTurnover = 0;

    bookings.forEach((b) => {
      if (b.paymentStatus === 'paid') {
        grossRevenue += b.taxBreakdown.grandTotal;
        totalGst += b.taxBreakdown.totalGst;
        cgst += b.taxBreakdown.cgst;
        sgst += b.taxBreakdown.sgst;

        if (b.taxBreakdown.roomGstRate === 12) {
          roomGst12Turnover += b.taxBreakdown.roomSubtotal;
        } else {
          roomGst18Turnover += b.taxBreakdown.roomSubtotal;
        }

        b.addonCharges.forEach((ad) => {
          const itemTot = ad.quantity * ad.unitPrice;
          if (ad.category === 'food') {
            foodTurnover += itemTot;
          } else {
            laundryTurnover += itemTot;
          }
        });
      }
    });

    const roomTurnover = roomGst12Turnover + roomGst18Turnover;
    const netTurnover = roomTurnover + foodTurnover + laundryTurnover;

    return {
      period: `FY ${financialYear}`,
      totalBookings: bookings.length,
      grossRevenue,
      roomTurnover,
      roomGst12Turnover,
      roomGst18Turnover,
      foodTurnover,
      laundryTurnover,
      cgst,
      sgst,
      totalGst,
      netTurnover,
    };
  },
};
