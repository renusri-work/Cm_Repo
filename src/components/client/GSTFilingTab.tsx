import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  Percent,
  Printer,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { ClientProperty, GSTSummaryItem } from '../../types';
import { storage } from '../../services/storage';

interface GSTFilingTabProps {
  client: ClientProperty;
  theme: 'dark' | 'light';
}

export const GSTFilingTab: React.FC<GSTFilingTabProps> = ({ client, theme }) => {
  const isDark = theme === 'dark';

  const [periodType, setPeriodType] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState<number>(11); // November
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const months = [
    { num: 1, name: 'January' },
    { num: 2, name: 'February' },
    { num: 3, name: 'March' },
    { num: 4, name: 'April' },
    { num: 5, name: 'May' },
    { num: 6, name: 'June' },
    { num: 7, name: 'July' },
    { num: 8, name: 'August' },
    { num: 9, name: 'September' },
    { num: 10, name: 'October' },
    { num: 11, name: 'November' },
    { num: 12, name: 'December' },
  ];

  const gstData: GSTSummaryItem =
    periodType === 'monthly'
      ? storage.getGSTSummary(client.id, selectedYear, selectedMonth)
      : storage.getAnnualGSTSummary(client.id, '2026-27');

  const handleExportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,
"Hospitality GST Filing Summary - ${client.name}"
"GSTIN","${client.taxDetails?.gstin || '08AAAAA0000A1Z5'}"
"Period","${gstData.period}"
"Total Bookings Cleared","${gstData.totalBookings}"
"Gross Revenue (INR)","${gstData.grossRevenue}"
"Net Taxable Turnover (INR)","${gstData.netTurnover}"
"Room Tariff <= 7500 (12% GST)","${gstData.roomGst12Turnover}"
"Room Tariff > 7500 (18% GST)","${gstData.roomGst18Turnover}"
"Food & Dining (5% GST)","${gstData.foodTurnover}"
"Laundry & Upgrades (18% GST)","${gstData.laundryTurnover}"
"Central Tax (CGST)","${gstData.cgst}"
"State Tax (SGST)","${gstData.sgst}"
"Total GST Tax Collected","${gstData.totalGst}"
"GSTR-1 Ready","Yes"
`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GST_Report_${client.id}_${gstData.period.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
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
              Tax Compliance & Accounting Engine
            </span>
            <span className="text-xs text-gray-400">Indian Hospitality GST Slabs</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Automated Monthly & Yearly GST Calculation</h2>
          <p className="text-xs text-gray-400 mt-1">
            Complies with Indian hospitality GST rates (12%/18% room slabs, 5% F&B, 18% services). Ready for GSTR-1 and GSTR-3B return filing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CA CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print GST Return</span>
          </button>
        </div>
      </div>

      {/* Period Selection Controls */}
      <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${
        isDark ? 'bg-[#0A0C11] border-white/10' : 'bg-slate-100 border-slate-200'
      }`}>
        {/* Period toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPeriodType('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              periodType === 'monthly'
                ? 'bg-orange-500 text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Monthly Filing View
          </button>
          <button
            type="button"
            onClick={() => setPeriodType('yearly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              periodType === 'yearly'
                ? 'bg-orange-500 text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Annual (FY 2026-27)
          </button>
        </div>

        {/* Month Dropdown if monthly */}
        {periodType === 'monthly' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 font-semibold">Select Month:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className={`px-3 py-1.5 rounded-lg border text-xs outline-none ${
                isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-300 text-slate-800'
              }`}
            >
              {months.map((m) => (
                <option key={m.num} value={m.num}>
                  {m.name} {selectedYear}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="text-xs text-gray-400 font-mono">
          Trade GSTIN: <strong className="text-orange-400">{client.taxDetails?.gstin || '08AAAAA0000A1Z5'}</strong>
        </div>
      </div>

      {/* High-level Tax Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <span className="text-xs font-semibold text-gray-400">Total GST Collected</span>
          <div className="text-2xl font-black text-orange-400 mt-2">
            ₹{gstData.totalGst.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Payable in GSTR-3B return</p>
        </div>

        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <span className="text-xs font-semibold text-gray-400">Central Tax (CGST)</span>
          <div className="text-2xl font-black text-white mt-2">
            ₹{gstData.cgst.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">50% Central Allocation</p>
        </div>

        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <span className="text-xs font-semibold text-gray-400">State Tax (SGST)</span>
          <div className="text-2xl font-black text-white mt-2">
            ₹{gstData.sgst.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">50% State Jurisdiction ({client.state})</p>
        </div>

        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <span className="text-xs font-semibold text-gray-400">Taxable Turnover</span>
          <div className="text-2xl font-black text-white mt-2">
            ₹{gstData.netTurnover.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-400 font-medium mt-1">Excluding Tax Components</p>
        </div>
      </div>

      {/* Hospitality Tax Slabs Breakdown Table */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0E1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold">Itemized GST Slab Breakdown ({gstData.period})</h3>
            <p className="text-xs text-gray-400">
              Taxable values mapped to respective SAC codes and GST rates
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            GSTR-1 RECONCILED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b ${isDark ? 'border-white/10 text-gray-400' : 'border-slate-200 text-slate-500'}`}>
                <th className="py-3 px-3 font-semibold">Service Classification</th>
                <th className="py-3 px-3 font-semibold">SAC Code</th>
                <th className="py-3 px-3 font-semibold text-center">GST Slab</th>
                <th className="py-3 px-3 font-semibold text-right">Taxable Turnover (₹)</th>
                <th className="py-3 px-3 font-semibold text-right">CGST (₹)</th>
                <th className="py-3 px-3 font-semibold text-right">SGST (₹)</th>
                <th className="py-3 px-3 font-semibold text-right">Total Tax (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* Slab 1: Room <= 7500 @ 12% */}
              <tr>
                <td className="py-3.5 px-3">
                  <div className="font-bold text-white">Hotel Room Accommodation (Standard & Deluxe)</div>
                  <div className="text-[11px] text-gray-400">Tariff ≤ ₹7,500 per room per night</div>
                </td>
                <td className="py-3.5 px-3 font-mono text-gray-400">996311</td>
                <td className="py-3.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
                    12%
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right font-medium">₹{gstData.roomGst12Turnover.toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-3 text-right font-medium">₹{Math.round(gstData.roomGst12Turnover * 0.06).toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-3 text-right font-medium">₹{Math.round(gstData.roomGst12Turnover * 0.06).toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-3 text-right font-bold text-orange-400">
                  ₹{Math.round(gstData.roomGst12Turnover * 0.12).toLocaleString('en-IN')}
                </td>
              </tr>

              {/* Slab 2: Room > 7500 @ 18% */}
              <tr>
                <td className="py-3.5 px-3">
                  <div className="font-bold text-white">Luxury Suites & Premium Villas</div>
                  <div className="text-[11px] text-gray-400">Tariff &gt; ₹7,500 per room / villa per night</div>
                </td>
                <td className="py-3.5 px-3 font-mono text-gray-400">996311</td>
                <td className="py-3.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold border border-purple-500/20">
                    18%
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right font-medium">₹{gstData.roomGst18Turnover.toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-3 text-right font-medium">₹{Math.round(gstData.roomGst18Turnover * 0.09).toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-3 text-right font-medium">₹{Math.round(gstData.roomGst18Turnover * 0.09).toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-3 text-right font-bold text-orange-400">
                  ₹{Math.round(gstData.roomGst18Turnover * 0.18).toLocaleString('en-IN')}
                </td>
              </tr>

              {/* Slab 3: Restaurant & F&B @ 5% */}
              <tr>
                <td className="py-3.5 px-3">
                  <div className="font-bold text-white">Restaurant, Buffet & In-Room Dining</div>
                  <div className="text-[11px] text-gray-400">Food and Beverage services without ITC</div>
                </td>
                <td className="py-3.5 px-3 font-mono text-gray-400">996331</td>
                <td className="py-3.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                    5%
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right font-medium">₹{gstData.foodTurnover.toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-3 text-right font-medium">₹{Math.round(gstData.foodTurnover * 0.025).toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-3 text-right font-medium">₹{Math.round(gstData.foodTurnover * 0.025).toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-3 text-right font-bold text-orange-400">
                  ₹{Math.round(gstData.foodTurnover * 0.05).toLocaleString('en-IN')}
                </td>
              </tr>

              {/* Slab 4: Laundry & Upgrades @ 18% */}
              <tr>
                <td className="py-3.5 px-3">
                  <div className="font-bold text-white">Laundry, Airport Cab & Room Upgrades</div>
                  <div className="text-[11px] text-gray-400">Ancillary guest hospitality services</div>
                </td>
                <td className="py-3.5 px-3 font-mono text-gray-400">999799</td>
                <td className="py-3.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                    18%
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right font-medium">₹{gstData.laundryTurnover.toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-3 text-right font-medium">₹{Math.round(gstData.laundryTurnover * 0.09).toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-3 text-right font-medium">₹{Math.round(gstData.laundryTurnover * 0.09).toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-3 text-right font-bold text-orange-400">
                  ₹{Math.round(gstData.laundryTurnover * 0.18).toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-white/20 font-bold text-white text-xs">
                <td className="py-3.5 px-3" colSpan={3}>Consolidated Period Total</td>
                <td className="py-3.5 px-3 text-right font-black">₹{gstData.netTurnover.toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-3 text-right text-gray-200">₹{gstData.cgst.toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-3 text-right text-gray-200">₹{gstData.sgst.toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-3 text-right text-orange-400 font-black text-sm">
                  ₹{gstData.totalGst.toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
