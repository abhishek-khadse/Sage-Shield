import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Medal,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  ChevronLeft,
  ChevronRight,
  Crown,
  Star,
  Target,
  Clock
} from 'lucide-react';

/*
  Leaderboard.jsx - Dark Cyber / Neon Theme
  - Single-file React component
  - Tailwind CSS utility classes (assumes Tailwind configured)
  - Matches Dashboard spacing & max-width (max-w-[1650px])
  - Uses lightweight helper class names: .cyber-card, .neon-btn, .icon-neon
  - Replace or extend those in your global CSS for glow effects
*/

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 80, damping: 16 }
  }
};

export default function Leaderboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const topPerformers = [
    { id: 1, name: 'Alex Morgan', role: 'Security Analyst Intern', score: 2450, avatar: 'AM', rank: 1, trend: 'up' },
    { id: 2, name: 'Sarah Chen', role: 'Blockchain Auditor', score: 2380, avatar: 'SC', rank: 2, trend: 'up' },
    { id: 3, name: 'James Wilson', role: 'Penetration Tester', score: 2150, avatar: 'JW', rank: 3, trend: 'down' }
  ];

  const leaderboardData = [
    { id: 4, name: 'Emily Davis', role: 'Web Security', score: 1980, rank: 4, trend: 'up' },
    { id: 5, name: 'Michael Brown', role: 'Network Engineer', score: 1850, rank: 5, trend: 'stable' },
    { id: 6, name: 'Jessica Taylor', role: 'Security Intern', score: 1740, rank: 6, trend: 'down' },
    { id: 7, name: 'David Miller', role: 'Python Dev', score: 1690, rank: 7, trend: 'up' },
    { id: 8, name: 'Sophia Anderson', role: 'Smart Contract Dev', score: 1620, rank: 8, trend: 'stable' }
  ];

  const currentUser = { id: 99, name: 'You', role: 'Security Intern', score: 1550, rank: 12, trend: 'up' };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_#05060a,_#061021_40%)] text-slate-100 py-10">
      <div className="w-full max-w-[1650px] mx-auto px-8 space-y-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

          {/* Header + Top Stats */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-extrabold tracking-tight">Leaderboard</h1>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-800/20 text-amber-300 border border-amber-800/10">
                  <Trophy size={14} className="icon-neon text-amber-300" /> Live Rankings
                </span>
              </div>
              <p className="text-slate-400 max-w-2xl">Track your ranking against peers. Points are awarded for completing modules, solving CTFs, and mentor reviews.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full sm:w-auto">
              <StatCard label="Your Rank" value={isLoading ? null : `#${currentUser.rank}`} loading={isLoading} />
              <StatCard label="Your Points" value={isLoading ? null : currentUser.score.toLocaleString()} loading={isLoading} emphasize />
              <StatCard label="To Next Rank" value={isLoading ? null : '+70'} loading={isLoading} accent />
            </div>
          </div>

          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              <>
                <TopSkeleton className="order-2 md:order-1 md:mt-8" />
                <TopSkeleton className="order-1 md:order-2" isWinner />
                <TopSkeleton className="order-3 md:order-3 md:mt-8" />
              </>
            ) : (
              <>
                <div className="order-2 md:order-1 md:mt-8">
                  <TopPerformerCard player={topPerformers[1]} label="2nd Place" tone="slate" icon={<Medal size={20} />} />
                </div>

                <div className="order-1 md:order-2">
                  <TopPerformerCard player={topPerformers[0]} label="1st Place" tone="amber" isWinner icon={<Crown size={22} />} />
                </div>

                <div className="order-3 md:order-3 md:mt-8">
                  <TopPerformerCard player={topPerformers[2]} label="3rd Place" tone="orange" icon={<Medal size={20} />} />
                </div>
              </>
            )}
          </div>

          {/* Leaderboard Table */}
          <div className="bg-[#081025]/60 border border-[#12203a]/40 rounded-2xl overflow-hidden shadow-2xl">

            <div className="px-6 md:px-8 py-5 border-b border-slate-800/30 bg-[linear-gradient(90deg,#061026_0%,rgba(6,16,38,0.3)_100%)]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-3"><Target size={18} className="icon-neon text-cyan-300" /> All Rankings</h2>
                  <p className="text-sm text-slate-400 mt-1">Complete ranking of all participants</p>
                </div>

                <div className="relative w-full md:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    className="pl-10 pr-4 py-2.5 bg-[#071028] border border-[#18304a] rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                    placeholder="Search interns..."
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800/30">
                    <th className="px-6 py-4 text-center">Rank</th>
                    <th className="px-6 py-4 text-left">Participant</th>
                    <th className="px-6 py-4 text-center">Trend</th>
                    <th className="px-6 py-4 text-right">Total XP</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.01)_0%,transparent_100%)]">
                  {isLoading ? (
                    <>
                      <RowSkeleton />
                      <RowSkeleton />
                      <RowSkeleton />
                      <RowSkeleton />
                      <RowSkeleton />
                    </>
                  ) : (
                    <>
                      {leaderboardData.map((p) => (
                        <LeaderboardRow key={p.id} player={p} />
                      ))}

                      {/* Highlight current user */}
                      <tr className="bg-gradient-to-r from-[#04203a]/40 to-[#062a43]/20 border-t border-slate-700/20">
                        <td className="px-6 py-5 text-center">
                          <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-500 text-slate-900 font-black text-sm shadow-neon">{currentUser.rank}</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-neon">ME</div>
                            <div>
                              <div className="font-bold text-slate-100 flex items-center gap-2">{currentUser.name}<span className="px-2 py-0.5 text-[10px] bg-cyan-600 text-black rounded uppercase font-bold">You</span></div>
                              <div className="text-xs text-slate-400 font-medium">{currentUser.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center"><TrendIcon trend={currentUser.trend} /></td>
                        <td className="px-6 py-5 text-right"><span className="font-mono font-extrabold text-cyan-300 text-lg">{currentUser.score.toLocaleString()}</span></td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 md:px-8 py-4 border-t border-slate-800/30 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[rgba(6,16,32,0.25)]">
              <span className="text-sm text-slate-400">Showing 4-11 of 142 participants</span>
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-lg border border-[#1f3650] text-slate-400 hover:text-slate-200 transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <div className="flex gap-2">
                  <button className="px-3 py-2 rounded-lg bg-cyan-600 text-slate-900 font-semibold">1</button>
                  <button className="px-3 py-2 rounded-lg border border-[#1f3650] text-slate-200">2</button>
                  <button className="px-3 py-2 rounded-lg border border-[#1f3650] text-slate-200">3</button>
                </div>
                <button className="p-2 rounded-lg border border-[#1f3650] text-slate-400 hover:text-slate-200 transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

          </div>

        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------
   Smaller Components / Skeletons
   ------------------------------ */

const StatCard = ({ label, value, loading, emphasize, accent }) => (
  <motion.div variants={itemVariants} className={`rounded-xl p-4 ${emphasize ? 'bg-gradient-to-br from-[#07172b]/40 to-[#062036]/40 border border-[#18324a]/40 shadow-neon' : 'bg-[#061425]/30 border border-[#112735]/30'} `}>
    <p className="text-xs text-slate-400 uppercase font-semibold mb-2">{label}</p>
    {loading ? (
      <div className="h-7 w-24 bg-[#0c2436] rounded animate-pulse" />
    ) : (
      <p className={`text-xl font-extrabold ${accent ? 'text-emerald-400' : 'text-cyan-300'}`}>{value}</p>
    )}
  </motion.div>
);

const TopSkeleton = ({ className = '', isWinner = false }) => (
  <div className={`bg-[#071022]/60 border border-[#122033]/30 rounded-2xl p-6 flex flex-col items-center text-center ${className} ${isWinner ? 'ring-2 ring-amber-400/20' : ''}`}>
    <div className="w-12 h-12 rounded-full bg-[#0b1930] animate-pulse mb-4"></div>
    <div className="w-20 h-20 rounded-2xl bg-[#082034] animate-pulse mb-4" />
    <div className="h-4 w-36 bg-[#071728] animate-pulse mb-2"></div>
    <div className="h-3 w-24 bg-[#071728] animate-pulse" />
  </div>
);

const RowSkeleton = () => (
  <tr>
    <td className="px-6 py-5 text-center"><div className="h-5 w-8 mx-auto bg-[#072033] rounded animate-pulse"></div></td>
    <td className="px-6 py-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#082035] animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 w-36 bg-[#071528] animate-pulse"></div>
          <div className="h-3 w-24 bg-[#071528] animate-pulse"></div>
        </div>
      </div>
    </td>
    <td className="px-6 py-5 text-center"><div className="h-6 w-12 mx-auto bg-[#071528] rounded animate-pulse"></div></td>
    <td className="px-6 py-5 text-right"><div className="h-5 w-20 ml-auto bg-[#072033] rounded animate-pulse"></div></td>
  </tr>
);

const TopPerformerCard = ({ player, label, tone = 'amber', isWinner = false, icon }) => {
  const toneMap = {
    amber: 'from-amber-400 to-amber-500',
    slate: 'from-slate-500 to-slate-600',
    orange: 'from-orange-400 to-orange-500'
  };

  return (
    <motion.div variants={itemVariants} whileHover={{ y: -8 }} className={`rounded-2xl p-6 text-center bg-[#07122a]/40 border border-[#122033]/30 shadow-lg ${isWinner ? 'ring-2 ring-amber-400/20' : ''}`}>
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${toneMap[tone]} flex items-center justify-center mb-4 shadow-neon`}>{icon}</div>
      <div className="w-20 h-20 rounded-2xl bg-[#08142a] flex items-center justify-center text-2xl font-black text-slate-300 mb-4 border-2 border-[#06162b]">{player.avatar}</div>
      <h3 className="font-bold text-slate-100 text-lg">{player.name}</h3>
      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-4">{player.role}</p>

      <div className="pt-4 border-t border-slate-800/30">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-extrabold text-slate-100">{player.score.toLocaleString()}</p>
        <p className="text-xs text-slate-400">Experience Points</p>
      </div>
    </motion.div>
  );
};

const LeaderboardRow = ({ player }) => (
  <motion.tr variants={itemVariants} className="hover:bg-[#071931]/40 transition-colors">
    <td className="px-6 py-5 text-center">
      <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#081a2d] text-slate-200 font-bold text-sm">{player.rank}</div>
    </td>
    <td className="px-6 py-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0f4060] to-[#163a6a] flex items-center justify-center text-white font-bold text-sm shadow-neon">{player.name.split(' ').map(n=>n[0]).join('')}</div>
        <div>
          <div className="font-bold text-slate-100">{player.name}</div>
          <div className="text-xs text-slate-400">{player.role}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-5 text-center"><TrendIcon trend={player.trend} /></td>
    <td className="px-6 py-5 text-right"><span className="font-mono font-extrabold text-cyan-300">{player.score.toLocaleString()}</span></td>
  </motion.tr>
);

const TrendIcon = ({ trend }) => {
  if (trend === 'up') return (
    <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-900/10 px-3 py-1 rounded-lg border border-emerald-600/20">
      <TrendingUp size={14} className="text-emerald-300" /> +4
    </div>
  );
  if (trend === 'down') return (
    <div className="inline-flex items-center gap-2 text-xs font-bold text-rose-300 bg-rose-900/10 px-3 py-1 rounded-lg border border-rose-600/20">
      <TrendingDown size={14} className="text-rose-300" /> -2
    </div>
  );
  return (
    <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 bg-[#071226] px-3 py-1 rounded-lg border border-[#122033]"> <Minus size={14} /> 0</div>
  );
};
