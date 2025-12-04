import React from "react";
import { Mail, Briefcase, Award } from "lucide-react";

const MyProfile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101624] via-[#151c2c] to-[#0f172a] p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* PROFILE HEADER */}
        <div className="bg-[#151c2c] border border-[#22304a] rounded-3xl shadow-lg shadow-black/40 overflow-hidden">
          {/* Cover */}
          <div className="relative h-40 w-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
                aria-hidden
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" aria-hidden />
          </div>

          {/* Profile content */}
          <div className="px-6 md:px-10 pb-8">
            <div className="relative flex flex-col items-center -mt-16 mb-6">
              {/* Avatar */}
              <div className="relative shrink-0 mb-4">
                <div
                  className="w-32 h-32 rounded-2xl ring-4 ring-white/10 bg-[#101624] shadow-xl overflow-hidden"
                  role="img"
                  aria-label="Profile avatar"
                >
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80"
                    alt="Alex Dev"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Name & info */}
              <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-100 tracking-tight mb-2">Alex Dev</h1>

                <span className="inline-flex items-center gap-1.5 text-cyan-300 font-semibold bg-cyan-900/20 px-3 py-1.5 rounded-lg text-sm border border-cyan-800/30 mb-3">
                  <Briefcase size={15} />
                  Security Analyst Intern
                </span>

                <p className="text-slate-400 font-medium mb-4">Web Security Track</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-[#22304a]">
              <StatPill
                value="18"
                label="Completed Courses"
                variant="cyan"
                ariaLabel="Completed courses: 18"
              />
              <StatPill
                value="2,450"
                label="Points Earned"
                variant="emerald"
                ariaLabel="Points earned: 2450"
              />
              <StatPill value="6" label="Certifications" variant="violet" ariaLabel="Certifications: 6" />
              <StatPill
                value="85%"
                label="Overall Progress"
                variant="amber"
                ariaLabel="Overall progress: 85 percent"
              />
            </div>
          </div>
        </div>

        {/* PERSONAL INFO (READ ONLY) */}
        <div className="bg-[#151c2c] border border-[#22304a] rounded-3xl shadow-lg shadow-black/30 overflow-hidden">
          <div className="px-6 md:px-10 py-6 border-b border-[#22304a] flex justify-between items-center bg-gradient-to-r from-[#101624] to-transparent">
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">Personal Information</h3>
            <span className="text-xs font-bold text-slate-400 uppercase bg-[#101624] px-3 py-1.5 rounded-lg border border-[#22304a]">
              Read Only
            </span>
          </div>

          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReadOnlyField label="First Name" value="Alex" />
              <ReadOnlyField label="Last Name" value="Dev" />

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    value="alex@albus.security"
                    readOnly
                    aria-readonly
                    className="w-full pl-12 pr-4 py-3.5 bg-[#101624] border border-[#22304a] rounded-xl text-sm font-semibold text-slate-200 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-900/40 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Phone Number</label>
                <input
                  type="tel"
                  value="+1 (555) 000-1234"
                  readOnly
                  aria-readonly
                  className="w-full px-4 py-3.5 bg-[#101624] border border-[#22304a] rounded-xl text-sm font-semibold text-slate-200 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-900/40 transition-all"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Bio</label>
                <textarea
                  rows="4"
                  readOnly
                  aria-readonly
                  value="Passionate about cybersecurity, blockchain forensics, and smart contract auditing. Currently learning Rust and Solidity to become a smart contract auditor."
                  className="w-full p-4 bg-[#101624] border border-[#22304a] rounded-xl text-sm font-medium text-slate-200 leading-relaxed cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-900/40 transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SKILLS */}
        <div className="bg-[#151c2c] border border-[#22304a] rounded-3xl shadow-lg shadow-black/30 overflow-hidden">
          <div className="px-6 py-5 border-b border-[#22304a] bg-gradient-to-r from-[#101624] to-transparent">
            <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
              <Award size={20} className="text-cyan-300" />
              Skills & Expertise
            </h3>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {[
                "Web Security",
                "Smart Contracts",
                "Rust",
                "Solidity",
                "Blockchain",
                "Penetration Testing",
                "OWASP",
                "Cryptography",
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-cyan-900/20 text-cyan-200 text-xs font-semibold rounded-lg border border-cyan-800/40"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -----------------------
   Subcomponents
   ----------------------- */

const StatPill = ({ value, label, variant = "cyan", ariaLabel }) => {
  const tone = {
    cyan: { bg: "bg-gradient-to-br from-cyan-900/30 to-transparent", text: "text-cyan-300", border: "border-cyan-800/40" },
    emerald: { bg: "bg-gradient-to-br from-emerald-900/30 to-transparent", text: "text-emerald-300", border: "border-emerald-800/40" },
    violet: { bg: "bg-gradient-to-br from-violet-900/30 to-transparent", text: "text-violet-300", border: "border-violet-800/40" },
    amber: { bg: "bg-gradient-to-br from-amber-900/30 to-transparent", text: "text-amber-300", border: "border-amber-800/40" },
  }[variant];

  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={`text-center p-4 rounded-xl ${tone.bg} ${tone.border} border ${tone.border.replace('/40','/40')}`}
    >
      <div className={`text-2xl font-bold ${tone.text}`}>{value}</div>
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-1">{label}</div>
    </div>
  );
};

const ReadOnlyField = ({ label, value }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{label}</label>
    <input
      readOnly
      aria-readonly
      value={value}
      className="w-full px-4 py-3.5 bg-[#101624] border border-[#22304a] rounded-xl text-sm font-semibold text-slate-200 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-900/40 transition-all"
    />
  </div>
);

export default MyProfile;
