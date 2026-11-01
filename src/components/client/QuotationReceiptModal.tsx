import React, { useRef, useState } from 'react';
import {
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  Printer,
  Receipt,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { Booking, ClientProperty } from '../../types';

interface QuotationReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  client: ClientProperty;
  initialMode?: 'quotation' | 'receipt';
  theme: 'dark' | 'light';
}

export const QuotationReceiptModal: React.FC<QuotationReceiptModalProps> = ({
  isOpen,
  onClose,
  booking,
  client,
  initialMode = 'receipt',
  theme,
}) => {
  const [docMode, setDocMode] = useState<'quotation' | 'receipt'>(initialMode);
  const printableRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !booking) return null;

  const isDark = theme === 'dark';
  const isReceipt = docMode === 'receipt';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const textData = `
=====================================================
${client.name.toUpperCase()}
${client.taxDetails?.address || `${client.city}, ${client.state}`}
GSTIN: ${client.taxDetails?.gstin || '08AAAAA0000A1Z5'}
Contact: ${client.phone} | ${client.email}
=====================================================
DOCUMENT: ${isReceipt ? 'OFFICIAL TAX INVOICE & RECEIPT' : 'PRO-FORMA QUOTATION / ESTIMATE'}
NUMBER: ${isReceipt ? `REC-${booking.id}` : `QUO-${booking.id}`}
DATE: ${new Date().toISOString().substring(0, 10)}
STATUS: ${isReceipt ? 'PAID & CONFIRMED' : 'VALID FOR 48 HOURS'}

GUEST DETAILS:
Guest Name: ${booking.guestName}
Email: ${booking.guestEmail}
Phone: ${booking.guestPhone}
ID Proof: ${booking.idProofType} (${booking.idProofNumber})

STAY PARTICULARS:
Room/Unit: ${booking.unitName}
Check-In: ${booking.checkInDate}
Check-Out: ${booking.checkOutDate} (${booking.numberOfNights} Nights)
Guests: ${booking.guestsCount.adults} Adults, ${booking.guestsCount.children} Children

CHARGES BREAKDOWN:
- Room Tariff: ${booking.numberOfNights} Nights @ ₹${booking.baseTariffPerNight} = ₹${booking.taxBreakdown.roomSubtotal} (GST @ ${booking.taxBreakdown.roomGstRate}%)
${booking.addonCharges.map((ad) => `- ${ad.name} (x${ad.quantity}): ₹${ad.quantity * ad.unitPrice} (GST @ ${ad.gstRatePercent}%)`).join('\n')}

TAX SUMMARY:
Room Subtotal: ₹${booking.taxBreakdown.roomSubtotal}
Room GST: ₹${booking.taxBreakdown.roomGst}
Add-ons Subtotal: ₹${booking.taxBreakdown.addonSubtotal}
Add-ons GST: ₹${booking.taxBreakdown.addonGst}
CGST (Central): ₹${booking.taxBreakdown.cgst}
SGST (State): ₹${booking.taxBreakdown.sgst}
-----------------------------------------------------
TOTAL AMOUNT: ₹${booking.taxBreakdown.grandTotal}
PAYMENT METHOD: ${booking.paymentMethod.toUpperCase()}
PAYMENT STATUS: ${isReceipt ? 'CONFIRMED & CLEARED' : 'PENDING APPROVAL'}
=====================================================
Thank you for choosing ${client.name}!
`;

    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${isReceipt ? 'Receipt' : 'Quotation'}_${booking.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl my-6 rounded-2xl border shadow-2xl overflow-hidden bg-white text-slate-900 border-orange-500/40 relative">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print p-4 bg-[#0F111A] text-white border-b border-orange-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDocMode('quotation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                docMode === 'quotation'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Quotation Mode
            </button>
            <button
              onClick={() => setDocMode('receipt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                docMode === 'receipt'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" /> Official Tax Receipt
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleDownloadText}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5"
              title="Download text summary"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Canvas */}
        <div ref={printableRef} className="printable-document p-8 bg-white text-slate-900 font-sans text-xs">
          {/* Header */}
          <div className="flex items-start justify-between border-b pb-6 mb-6 border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-sm bg-orange-600 inline-block" />
                <h1 className="text-xl font-black text-slate-900 tracking-tight">{client.name}</h1>
              </div>
              <p className="text-slate-500 text-[11px]">{client.taxDetails?.address || `${client.city}, ${client.state}`}</p>
              <p className="text-slate-500 text-[11px]">Phone: {client.phone} • Email: {client.email}</p>
              <p className="text-slate-700 font-mono font-semibold text-[11px] mt-1">
                GSTIN: <span className="font-bold text-orange-600">{client.taxDetails?.gstin || '08AAAAA0000A1Z5'}</span>
              </p>
            </div>

            <div className="text-right">
              <span
                className={`inline-block px-3 py-1 rounded text-xs font-extrabold uppercase tracking-wider mb-2 ${
                  isReceipt
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-orange-100 text-orange-800 border border-orange-300'
                }`}
              >
                {isReceipt ? 'TAX INVOICE & RECEIPT' : 'PRO-FORMA QUOTATION'}
              </span>
              <p className="font-mono text-slate-500 text-[11px]">
                Doc #: <strong className="text-slate-800">{isReceipt ? `INV-${booking.id}` : `EST-${booking.id}`}</strong>
              </p>
              <p className="text-slate-500 text-[11px]">Date: {new Date().toLocaleDateString('en-IN')}</p>
              {isReceipt ? (
                <p className="text-emerald-600 font-bold text-[11px] flex items-center justify-end gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" /> PAYMENT CONFIRMED
                </p>
              ) : (
                <p className="text-orange-600 font-medium text-[11px] mt-0.5">Valid for 48 Hours</p>
              )}
            </div>
          </div>

          {/* Guest & Stay Details Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Guest Information
              </span>
              <p className="font-bold text-sm text-slate-900">{booking.guestName}</p>
              <p className="text-slate-600 text-[11px]">{booking.guestPhone} • {booking.guestEmail}</p>
              <p className="text-slate-500 text-[10px] mt-1">
                ID Proof: <strong>{booking.idProofType}</strong> ({booking.idProofNumber})
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Stay Particulars
              </span>
              <p className="font-bold text-sm text-slate-900">{booking.unitName}</p>
              <p className="text-slate-600 text-[11px]">
                Check-in: <strong>{booking.checkInDate}</strong> &rarr; Check-out: <strong>{booking.checkOutDate}</strong>
              </p>
              <p className="text-slate-500 text-[10px] mt-1">
                Duration: <strong>{booking.numberOfNights} Nights</strong> • Guests: {booking.guestsCount.adults} Adults
                {booking.guestsCount.children > 0 && `, ${booking.guestsCount.children} Children`}
              </p>
            </div>
          </div>

          {/* Charges Table */}
          <table className="w-full text-left mb-6 border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300 text-slate-600 text-[11px] uppercase tracking-wider">
                <th className="py-2.5">Description</th>
                <th className="py-2.5 text-center">Category / SAC</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Unit Rate</th>
                <th className="py-2.5 text-center">GST Rate</th>
                <th className="py-2.5 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {/* Room Tariff */}
              <tr>
                <td className="py-2.5">
                  <p className="font-semibold text-slate-900">Room Accommodation: {booking.unitName}</p>
                  <span className="text-[10px] text-slate-500">{booking.numberOfNights} nights stay tariff</span>
                </td>
                <td className="py-2.5 text-center font-mono text-[10px] text-slate-600">SAC 996311</td>
                <td className="py-2.5 text-center">{booking.numberOfNights} N</td>
                <td className="py-2.5 text-right">₹{booking.baseTariffPerNight.toLocaleString('en-IN')}</td>
                <td className="py-2.5 text-center font-semibold text-orange-600">{booking.taxBreakdown.roomGstRate}%</td>
                <td className="py-2.5 text-right font-medium">₹{booking.taxBreakdown.roomSubtotal.toLocaleString('en-IN')}</td>
              </tr>

              {/* Add-on items */}
              {booking.addonCharges.map((item) => (
                <tr key={item.id}>
                  <td className="py-2.5">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <span className="text-[10px] text-slate-500 capitalize">{item.category.replace('_', ' ')} add-on</span>
                  </td>
                  <td className="py-2.5 text-center font-mono text-[10px] text-slate-600">
                    {item.category === 'food' ? 'SAC 996331' : 'SAC 999799'}
                  </td>
                  <td className="py-2.5 text-center">{item.quantity}</td>
                  <td className="py-2.5 text-right">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 text-center font-semibold text-orange-600">{item.gstRatePercent}%</td>
                  <td className="py-2.5 text-right font-medium">
                    ₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tax Calculation & Totals Box */}
          <div className="flex justify-end mb-6">
            <div className="w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Room Charges Subtotal:</span>
                <span className="font-semibold text-slate-900">₹{booking.taxBreakdown.roomSubtotal.toLocaleString('en-IN')}</span>
              </div>
              {booking.taxBreakdown.addonSubtotal > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Additional Services Subtotal:</span>
                  <span className="font-semibold text-slate-900">₹{booking.taxBreakdown.addonSubtotal.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                <span>Central GST (CGST):</span>
                <span className="font-semibold text-slate-900">₹{booking.taxBreakdown.cgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>State GST (SGST):</span>
                <span className="font-semibold text-slate-900">₹{booking.taxBreakdown.sgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs text-orange-700 font-medium">
                <span>Total Tax Liability:</span>
                <span>₹{booking.taxBreakdown.totalGst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t-2 border-slate-800">
                <span>Grand Total:</span>
                <span className="text-orange-600">₹{booking.taxBreakdown.grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Settlement Method:</span>
                <span className="font-bold uppercase text-slate-800">{booking.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Footer & Signature */}
          <div className="border-t pt-6 border-slate-200 flex items-end justify-between text-[11px] text-slate-500">
            <div>
              <p className="font-semibold text-slate-700 mb-1">Terms & Conditions:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                <li>Standard check-in 14:00 hrs & check-out 11:00 hrs.</li>
                <li>Valid government-issued photo ID required upon arrival.</li>
                <li>Applicable GST charged in accordance with Indian Hospitality tax regulations.</li>
              </ul>
            </div>

            <div className="text-center w-48">
              <div className="w-24 h-12 border-b border-dashed border-slate-400 mx-auto mb-1 flex items-center justify-center text-[10px] text-slate-400 font-serif italic">
                AuraStay Verified
              </div>
              <p className="font-bold text-slate-800 text-[11px]">Authorized Signatory</p>
              <p className="text-[10px] text-slate-400">{client.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
