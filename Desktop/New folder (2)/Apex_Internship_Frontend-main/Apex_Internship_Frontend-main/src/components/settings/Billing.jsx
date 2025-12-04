import React from "react";
import { Check, Download, Shield, CreditCard, Clock } from "lucide-react";

/**
 * Billing.jsx
 * - Dark cyber hybrid (B3 / PM3)
 * - Full-width (max-w-[1650px]) layout
 * - Indigo-accent border on Payment Method card (PM3)
 * - Neon hover effects for invoice download
 *
 * Tailwind classes expected (config similar to other pages).
 */

const Billing = () => {
  // sample invoice rows
  const invoices = [
    {
      id: "inv-20251001",
      date: "Oct 01, 2025",
      description: "Registration Fee — Apex Internship",
      amount: "₹1,999.00",
      status: "Paid",
    },
    {
      id: "inv-20250910",
      date: "Sep 10, 2025",
      description: "Course: Cyber Security Fundamentals",
      amount: "₹3,499.00",
      status: "Paid",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050811] text-slate-200 py-12 px-6">
      <div className="max-w-[1650px] mx-auto space-y-8">

        {/* Header */}
        <header className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Billing & Subscription</h1>
            <p className="text-slate-400 mt-1">Manage your plan, payment methods, and invoices</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="text-sm text-slate-400">Last payment</div>
            <div className="px-3 py-2 bg-[#0f172a] rounded-lg border border-[#1f2a40] text-sm font-medium">
              ₹1,999 • Oct 01, 2025
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Sidebar-like quick cards (keeps space similar to settings) */}
          <aside className="order-2 xl:order-1 xl:col-span-1 space-y-6">
            <div className="rounded-2xl bg-[#0f172a] border border-[#1f2a40] p-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#081126] border border-[#112135]">
                  <Shield className="text-cyan-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">Plan</p>
                  <div className="text-lg font-bold text-white">Pro • Monthly</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-slate-400">
                Next billing on <strong className="text-slate-200">Nov 01, 2025</strong>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0f172a] border border-[#1f2a40] p-4 shadow-md">
              <p className="text-sm text-slate-400">Payment Methods</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#07121b] border border-[#122033]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold">
                      UPI
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-100">UPI • alex@upi</div>
                      <div className="text-xs text-slate-400">Primary • Verified</div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#05281e] border border-emerald-700/20 text-emerald-300">
                    <Check size={14} />
                    <span className="text-xs font-semibold">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Middle & Right: Main content */}
          <div className="order-1 xl:order-2 xl:col-span-2 space-y-6">

            {/* Payment Method Card (PM3: Indigo Accent Glow) */}
            <div className="rounded-2xl relative p-1"
                 aria-hidden>
              {/* Indigo gradient frame */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent to-transparent pointer-events-none"
                   style={{ boxShadow: "0 6px 30px rgba(79, 70, 229, 0.06)" }} />
              <div className="relative rounded-2xl bg-[#0b1220] border border-[#1c273d] overflow-hidden">
                {/* Accent top border */}
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-600/20 via-transparent to-cyan-400/10 blur-sm opacity-60 pointer-events-none"></div>

                <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-lg font-black shadow-lg">
                      UPI
                    </div>

                    <div>
                      <div className="text-sm text-cyan-200 font-semibold">Payment Completed via UPI</div>
                      <div className="mt-1 text-sm text-slate-300">Verified payment method — bank-level encryption</div>
                      <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
                        <Clock size={12} />
                        <span>Verified on Oct 01, 2025</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-lg bg-[#05281e] border border-emerald-700/20 text-emerald-300 inline-flex items-center gap-2">
                      <Check size={14} /> <span className="text-sm font-semibold">Verified</span>
                    </div>

                    <button className="px-4 py-2 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-black font-bold hover:scale-[1.02] transition transform shadow-neon">
                      Set Primary
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice History Card */}
            <div className="rounded-2xl bg-[#0b1220] border border-[#1c273d] p-6 shadow-md overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">Invoice History</h3>
                  <p className="text-sm text-slate-400 mt-1">Download past invoices and receipts</p>
                </div>

                <div className="flex items-center gap-3">
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#071232] border border-[#183053] text-slate-300 hover:bg-[#0b1730] transition">
                    <Download size={16} /> Export All
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="text-left text-slate-400 text-xs uppercase tracking-wider border-b border-[#122033]">
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-right">Invoice</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#0e2130]">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-[#071427] transition-colors">
                        <td className="px-4 py-4 align-top">
                          <div className="text-sm font-semibold text-slate-200">{inv.date}</div>
                          <div className="text-xs text-slate-400">Fiscal Year 2025-26</div>
                        </td>

                        <td className="px-4 py-4 align-top">
                          <div className="text-sm text-slate-200 font-medium">{inv.description}</div>
                          <div className="text-xs text-slate-400 mt-1">Payment for course / registration</div>
                        </td>

                        <td className="px-4 py-4 align-top">
                          <div className="font-mono font-bold text-slate-200">{inv.amount}</div>
                        </td>

                        <td className="px-4 py-4 align-top text-center">
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#05281e] border border-emerald-700/20 text-emerald-300 text-xs font-semibold">
                            <Check size={12} /> {inv.status}
                          </span>
                        </td>

                        <td className="px-4 py-4 align-top text-right">
                          <button
                            title="Download invoice"
                            className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#071232] border border-transparent hover:border-indigo-600/30 transition all"
                          >
                            <Download className="text-slate-300 hover:text-indigo-300 transition-colors" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-[#071122] border border-[#122033] text-center text-xs text-slate-400">
                All invoices are generated automatically and available for download.
              </div>
            </div>

            {/* Info Banner (dark) */}
            <div className="rounded-2xl bg-[#071227] border border-[#122033] p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-indigo-900/30 flex items-center justify-center border border-indigo-700/20">
                <Shield className="text-cyan-300" size={20} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Secure Payment Processing</h4>
                <p className="text-sm text-slate-400 mt-1">
                  All transactions processed through UPI with bank-level encryption. We never store raw payment credentials on our servers.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
