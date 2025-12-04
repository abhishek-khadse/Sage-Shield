import React, { useState } from "react";
import { Lock, Bell, Shield, Mail } from "lucide-react";

const AccountSettings = () => {
  const [emailNotifs, setEmailNotifs] = useState(true);

  return (
    <div className="space-y-8 text-slate-200">

      {/* EMAIL SETTINGS */}
      <Card>
        <SectionHeader 
          icon={
            <div className="p-2 rounded-lg bg-indigo-900/40 text-indigo-400 border border-indigo-700/30">
              <Mail size={20} />
            </div>
          } 
          title="Email Address"
        />

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">
              Primary Email
            </label>

            <input
              type="email"
              defaultValue="alex@albus.security"
              className="
                w-full p-3 bg-[#0f172a] border border-[#1e293b] 
                rounded-xl text-sm font-medium text-slate-200 
                focus:outline-none focus:border-indigo-500/80 
                focus:ring-1 focus:ring-indigo-500/50 
                transition
              "
            />
          </div>

          <button className="
            px-6 py-3 rounded-xl text-sm font-bold 
            bg-[#1e293b] border border-[#334155] 
            hover:bg-[#243044] hover:border-indigo-600/40 
            text-slate-300 transition-all
          ">
            Update Email
          </button>
        </div>
      </Card>

      {/* SECURITY SETTINGS */}
      <Card>
        <SectionHeader 
          icon={
            <div className="p-2 rounded-lg bg-indigo-900/40 text-indigo-400 border border-indigo-700/30">
              <Lock size={20} />
            </div>
          }
          title="Security"
        />

        <div className="space-y-4">

          {/* CHANGE PASSWORD */}
          <SecurityRow
            title="Change Password"
            subtitle="Last changed 3 months ago"
            action="Change"
          />

          {/* 2FA */}
          <div className="
            flex items-center justify-between 
            p-4 rounded-xl bg-[#0f172a] border border-[#1e293b]
          ">
            <div>
              <p className="text-sm font-bold text-slate-200">
                Two-Factor Authentication
              </p>
              <p className="text-xs text-slate-400">
                Add an extra layer of security
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="
                text-[10px] font-bold px-2 py-1 rounded 
                bg-emerald-900/40 text-emerald-300 border border-emerald-600/30
              ">
                Enabled
              </span>

              <button className="text-xs font-bold text-indigo-400 hover:underline">
                Config
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* NOTIFICATIONS */}
      <Card>
        <SectionHeader 
          icon={
            <div className="p-2 rounded-lg bg-indigo-900/40 text-indigo-400 border border-indigo-700/30">
              <Bell size={20} />
            </div>
          }
          title="Notifications"
        />

        <div className="space-y-4">

          <NotifToggle
            label="Email me about new assignments"
            checked={emailNotifs}
            onChange={() => setEmailNotifs(!emailNotifs)}
          />

          <NotifToggle
            label="Email me about mentor feedback"
            checked={true}
          />

          <NotifToggle
            label="Community mention alerts"
            checked={true}
          />

        </div>
      </Card>

    </div>
  );
};

export default AccountSettings;


/* ------------------------------
   SUB-COMPONENTS
--------------------------------*/

const Card = ({ children }) => (
  <div className="
    bg-[#111827] 
    border border-[#1f2a40] 
    rounded-2xl p-8 
    shadow-lg shadow-black/20
  ">
    {children}
  </div>
);

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-6">
    {icon}
    <h3 className="text-lg font-bold text-slate-100">{title}</h3>
  </div>
);

const SecurityRow = ({ title, subtitle, action }) => (
  <div className="
    flex items-center justify-between 
    p-4 rounded-xl bg-[#0f172a] border border-[#1e293b]
  ">
    <div>
      <p className="text-sm font-bold text-slate-200">{title}</p>
      <p className="text-xs text-slate-400">{subtitle}</p>
    </div>

    <button className="text-xs font-bold text-indigo-400 hover:underline">
      {action}
    </button>
  </div>
);

const NotifToggle = ({ label, checked, onChange }) => (
  <label className="
    flex items-center justify-between 
    cursor-pointer p-3 rounded-lg 
    hover:bg-[#1a2438] transition-colors
  ">
    <span className="text-sm font-medium text-slate-300">{label}</span>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="
        w-5 h-5 rounded border-[#334155] 
        text-indigo-500 focus:ring-indigo-500 
        bg-[#0f172a]
      "
    />
  </label>
);
