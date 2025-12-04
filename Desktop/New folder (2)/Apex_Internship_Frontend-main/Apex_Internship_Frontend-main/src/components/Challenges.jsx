import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Flag,
  Terminal,
  Shield,
  Globe,
  Lock,
  CheckCircle2,
  Play,
  Cpu,
  Hash,
  Zap,
  Clock,
  Sparkles
} from "lucide-react";

/*
  Challenges.jsx - Dark Cyber Neon Theme (C1)
  - Single-file React component
  - Tailwind CSS utilities expected (Tailwind configured)
  - Uses helper utility classes for neon/glow (shadow-neon, icon-neon, glass-panel)
  - max-width: 1650px to match Dashboard/Leaderboard
  - Polished spacing, motion, and responsive layout
*/

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.06 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 14 } }
};

export default function Challenges() {
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", "Web Security", "Cryptography", "System Security", "Forensics"];

  const challenges = [
    {
      id: 1,
      title: "SQL Injection Basics",
      category: "Web Security",
      points: 100,
      difficulty: "Easy",
      status: "Solved",
      time: "30m",
      icon: <Globe size={18} />
    },
    {
      id: 2,
      title: "Crack the Hash",
      category: "Cryptography",
      points: 200,
      difficulty: "Medium",
      status: "Active",
      time: "1h",
      icon: <Hash size={18} />
    },
    {
      id: 3,
      title: "Linux Privilege Escalation",
      category: "System Security",
      points: 300,
      difficulty: "Hard",
      status: "Locked",
      time: "2h",
      icon: <Terminal size={18} />
    },
    {
      id: 4,
      title: "XSS Domination",
      category: "Web Security",
      points: 150,
      difficulty: "Medium",
      status: "Active",
      time: "45m",
      icon: <Globe size={18} />
    },
    {
      id: 5,
      title: "Buffer Overflow 101",
      category: "System Security",
      points: 250,
      difficulty: "Hard",
      status: "Locked",
      time: "3h",
      icon: <Cpu size={18} />
    },
    {
      id: 6,
      title: "Packet Analysis",
      category: "Forensics",
      points: 100,
      difficulty: "Easy",
      status: "Active",
      time: "30m",
      icon: <Shield size={18} />
    }
  ];

  const filtered = activeFilter === "All" ? challenges : challenges.filter((c) => c.category === activeFilter);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_#02030a_0%,_#071226_40%)] text-slate-100 py-10">
      <div className="w-full max-w-[1650px] mx-auto px-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/40 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Challenge Lab</h1>
              <p className="text-slate-400 mt-2 max-w-2xl">Hands-on cybersecurity labs. Complete missions to earn XP and badges.</p>
            </div>

            <div className="flex gap-4">
              <StatPill icon={<Flag size={16} />} label="CTF Score" value="1,250" accent="cyan" />
              <StatPill icon={<Sparkles size={16} />} label="Rank" value="#12" accent="amber" />
            </div>
          </div>

          {/* Featured Mission (neon-heavy) */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} className="relative">
            <div className="cyber-card glass-panel overflow-hidden rounded-2xl border border-[#17314a] shadow-neon-lg">
              {/* neon halo */}
              <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-[#2b6cff] opacity-10 blur-3xl mix-blend-screen" />
              <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-[#7c3aed] opacity-6 blur-3xl mix-blend-screen" />

              <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-600 to-cyan-400 text-black shadow-sm"> 
                      <Zap size={14} className="text-white" /> Spotlight Mission
                    </span>
                    <span className="text-sm text-slate-400 flex items-center gap-2"><Clock size={14} /> Est. Time: 2 Hours</span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Metasploit Framework: Zero to Hero</h2>
                  <p className="text-slate-300 max-w-2xl leading-relaxed mb-6">Master the industry-standard penetration testing framework. In this lab you will configure listeners, generate payloads, and exploit a vulnerable Windows machine.</p>

                  <div className="flex items-center gap-4">
                    <button className="neon-btn px-6 py-3 rounded-lg font-bold flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-indigo-600 text-black shadow-neon">Start Mission <Play size={14} /></button>
                    <span className="text-sm text-cyan-300 font-bold">+500 XP Reward</span>
                  </div>
                </div>

                <div className="hidden md:flex items-center justify-center w-36 h-36 bg-[#021428]/60 rounded-2xl border border-[#10314a] shadow-neon p-3">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#04162a] to-[#082040] flex items-center justify-center border border-[#0a273f] shadow-inner">
                    <Terminal size={48} className="text-cyan-300" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="border-b border-slate-800/30 pb-4">
            <div className="flex gap-6 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`relative pb-3 text-sm font-semibold whitespace-nowrap transition-all ${activeFilter === cat ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {cat}
                  {activeFilter === cat && <motion.span layoutId="tab" className="absolute left-0 bottom-0 w-full h-0.5 bg-cyan-500 rounded" />}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Challenges */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <ChallengeCard key={c.id} {...c} />
            ))}
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------
   Subcomponents
   ------------------------ */

const StatPill = ({ icon, label, value, accent = 'cyan' }) => {
  const accentMap = {
    cyan: 'bg-gradient-to-br from-cyan-600 to-indigo-500 text-black',
    amber: 'bg-gradient-to-br from-amber-400 to-amber-500 text-black'
  };

  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl ${accentMap[accent]} shadow-sm`}> 
      <div className="p-2 rounded-lg bg-white/10 flex items-center justify-center text-slate-50">{icon}</div>
      <div>
        <p className="text-[10px] font-semibold text-slate-200 uppercase">{label}</p>
        <p className="text-lg font-extrabold text-white leading-none">{value}</p>
      </div>
    </div>
  );
};

const ChallengeCard = ({ title, category, points, difficulty, status, time, icon }) => {
  const locked = status === 'Locked';
  const solved = status === 'Solved';

  const diffStyles = {
    Easy: 'bg-emerald-900/60 text-emerald-300',
    Medium: 'bg-amber-900/50 text-amber-300',
    Hard: 'bg-rose-900/50 text-rose-300'
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={!locked ? { y: -6, boxShadow: '0 20px 40px rgba(18,60,120,0.15)' } : {}
      }
      className={`bg-[#061427] border border-[#112b40] rounded-xl p-5 flex flex-col justify-between shadow-sm transition-all relative overflow-hidden ${locked ? 'opacity-70' : ''}`}>

      <div>
        <div className="flex justify-between items-start mb-3">
          <div className={`p-2 rounded-lg ${locked ? 'bg-[#07182a] text-slate-500' : 'bg-[#062238] text-cyan-300'} border border-[#092437]`}>{icon}</div>

          <div className="text-sm text-slate-400 font-medium">
            {solved ? (
              <span className="inline-flex items-center gap-2 bg-[#052a1b] text-emerald-300 px-2 py-1 rounded-full font-bold border border-emerald-700/20">
                <CheckCircle2 size={14} /> Solved
              </span>
            ) : (
              <span className="text-slate-400">{points} XP</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{category}</span>
          <span className="text-xs text-slate-400 flex items-center gap-2"><Clock size={12} /> {time}</span>
        </div>

        <h3 className="text-lg font-bold text-white mb-4 leading-tight">{title}</h3>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#0f2233]">
        <span className={`px-2 py-1 rounded text-[11px] font-bold uppercase ${diffStyles[difficulty]}`}>{difficulty}</span>

        {locked ? (
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-[#061427]/60 text-slate-400 border border-[#092437] cursor-not-allowed"><Lock size={16} /></button>
            <span className="text-xs text-slate-500">Locked</span>
          </div>
        ) : (
          <button className="inline-flex items-center gap-2 text-sm font-bold text-black bg-gradient-to-r from-cyan-400 to-indigo-600 px-3 py-2 rounded-lg shadow-neon hover:scale-[1.01] transition-transform">
            View Lab <Play size={14} />
          </button>
        )}
      </div>

      {/* subtle neon edge */}
      <div className="absolute inset-0 pointer-events-none rounded-xl border border-transparent" />
    </motion.div>
  );
};
