import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  User, 
  Settings, 
  CreditCard, 
  HelpCircle, 
  Award 
} from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsLayout = () => {
  
  const links = [
    { name: 'My Profile', path: '/settings/profile', icon: <User size={18} /> },
    { name: 'My Grades', path: '/settings/grades', icon: <Award size={18} /> },
    { name: 'Account Settings', path: '/settings/account', icon: <Settings size={18} /> },
    { name: 'Billing & Plan', path: '/settings/billing', icon: <CreditCard size={18} /> },
    { name: 'Help Center', path: '/settings/help', icon: <HelpCircle size={18} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 mt-8 px-4">
      
      {/* HEADER */}
      <div className="border-b border-[#22304a] pb-6 bg-gradient-to-r from-[#101624] to-transparent rounded-xl p-6 shadow-lg shadow-black/20">
        <h1 className="text-3xl font-black text-slate-100">User Settings</h1>
        <p className="text-slate-400 mt-1">Manage your profile, preferences, and internship progress.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* SIDEBAR */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="flex flex-col gap-2">
            {links.map(link => (
              <NavLink 
                key={link.name}
                to={link.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all border 
                  ${
                    isActive
                    ? 'bg-cyan-900/20 text-cyan-300 border-cyan-800/40 shadow-[0_0_12px_rgba(0,255,255,0.2)]'
                    : 'text-slate-400 border-transparent hover:bg-[#151c2c] hover:text-slate-100 hover:border-[#22304a]'
                  }
                `}
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}
          </div>
        </aside>

        {/* CONTENT AREA */}
        <motion.div 
          className="flex-1 w-full bg-[#151c2c] border border-[#22304a] rounded-2xl shadow-xl shadow-black/30 p-6 lg:p-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet /> 
        </motion.div>

      </div>
    </div>
  );
};

export default SettingsLayout;
