import React from "react";
import {
  Award,
  CheckCircle2,
  Download,
  Clock,
  TrendingUp,
  BookOpen,
} from "lucide-react";

/**
 * MyGrades.jsx - Dark Cyber Hybrid (GS2) with STRONG Glow (GI3)
 * - Full-width (max-w-[1650px]) container
 * - Dark cards, neon accents, strong glow on select elements
 * - Tailwind CSS utility classes assumed
 */

const MyGrades = () => {
  const modules = [
    { id: 1, name: "Cyber Security Fundamentals", score: 98, status: "Passed", date: "Sep 15, 2025", credits: 4, grade: "A+" },
    { id: 2, name: "Networking Essentials", score: 92, status: "Passed", date: "Sep 30, 2025", credits: 4, grade: "A" },
    { id: 3, name: "Programming with Python", score: 88, status: "Passed", date: "Oct 10, 2025", credits: 6, grade: "A" },
    { id: 4, name: "Web Security & VAPT", score: null, status: "In Progress", date: "-", credits: 8, grade: "-" },
  ];

  // derived stats
  const completedModules = modules.filter((m) => m.score !== null);
  const totalCompleted = completedModules.length;
  const totalModules = modules.length;
  const avgScore = completedModules.length ? (completedModules.reduce((a, b) => a + b.score, 0) / completedModules.length).toFixed(1) : "—";
  const totalCredits = completedModules.reduce((a, b) => a + b.credits, 0);

  // strong glow style (used inline for predictability)
  const strongGlow = "0 10px 40px rgba(79, 70, 229, 0.18), 0 6px 18px rgba(6, 182, 212, 0.06)";

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 py-12 px-6">
      <div className="max-w-[1650px] mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">Academic Performance</h1>
            <p className="text-slate-400 mt-1">Track your progress, credits, and achievements</p>
          </div>

          <div className="flex items-center gap-3 mt-3 md:mt-0">
            <div className="text-sm text-slate-400">Latest update</div>
            <div className="px-3 py-2 rounded-lg bg-[#0f172a] border border-[#1f2a40] text-sm font-medium">
              Nov 01, 2025
            </div>
          </div>
        </header>

        {/* Summary cards (GS2: dark + glow) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Average Score"
            value={`${avgScore}%`}
            accent="cyan"
            icon={<Award size={20} />}
            glowStyle={strongGlow}
            subtitle="Average across completed modules"
          />
          <StatCard
            title="Courses Completed"
            value={`${totalCompleted}/${totalModules}`}
            accent="emerald"
            icon={<CheckCircle2 size={20} />}
            glowStyle={strongGlow}
            subtitle="Modules passed"
          />
          <StatCard
            title="Credits Earned"
            value={totalCredits}
            accent="violet"
            icon={<BookOpen size={20} />}
            glowStyle={strongGlow}
            subtitle="Total credit points"
          />
          <StatCard
            title="Overall Grade"
            value="A"
            accent="amber"
            icon={<TrendingUp size={20} />}
            glowStyle={strongGlow}
            subtitle="Cumulative grade"
          />
        </div>

        {/* Grades Table */}
        <div className="rounded-2xl bg-[#0b1220] border border-[#1c273d] shadow-[0_10px_40px_rgba(6,22,48,0.6)] overflow-hidden">
          <div className="p-6 md:p-8 flex items-center justify-between border-b border-[#122033] bg-gradient-to-r from-transparent to-transparent">
            <div>
              <h2 className="text-2xl font-bold text-white">Course Grades</h2>
              <p className="text-sm text-slate-400 mt-1">Detailed performance breakdown & transcript</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-black bg-gradient-to-br from-indigo-500 to-cyan-400 hover:scale-[1.02] transition transform"
                style={{ boxShadow: "0 8px 30px rgba(14,116,144,0.14), 0 4px 12px rgba(99,102,241,0.08)" }}
              >
                <Download size={16} /> Export Transcript
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-xs text-slate-400 uppercase tracking-wider bg-[#071427] border-b border-[#122033]">
                  <th className="px-6 py-3 text-left">Course Name</th>
                  <th className="px-6 py-3 text-left hidden md:table-cell">Completion Date</th>
                  <th className="px-6 py-3 text-center">Credits</th>
                  <th className="px-6 py-3 text-center">Score</th>
                  <th className="px-6 py-3 text-center">Grade</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#0e2130]">
                {modules.map((m) => (
                  <tr
                    key={m.id}
                    className="transition-colors hover:bg-[#071427] cursor-default"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-11 h-11 rounded-lg flex items-center justify-center font-bold text-sm`}
                          style={{
                            background: m.status === "Passed" ? "linear-gradient(180deg,#07122a,#0b1830)" : "#071427",
                            color: m.status === "Passed" ? "#a5b4fc" : "#94a3b8",
                            boxShadow: m.status === "Passed" ? "0 8px 30px rgba(99,102,241,0.16)" : "none",
                            border: "1px solid rgba(255,255,255,0.02)",
                          }}
                        >
                          {m.id}
                        </div>

                        <div>
                          <div className="text-sm font-semibold text-white">{m.name}</div>
                          <div className="text-xs text-slate-400 md:hidden">{m.date}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-400 hidden md:table-cell">{m.date}</td>

                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#071427] border border-[#122033] text-sm font-bold text-slate-200">
                        {m.credits}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {m.score !== null ? (
                        <span
                          className="text-lg font-extrabold"
                          style={{
                            color: m.score >= 95 ? "#34d399" : m.score >= 90 ? "#60a5fa" : "#94a3b8",
                            textShadow: m.score >= 90 ? "0 6px 30px rgba(79,70,229,0.18)" : "none",
                          }}
                        >
                          {m.score}%
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {m.grade !== "-" ? (
                        <div
                          className="inline-flex items-center justify-center w-10 h-10 rounded-lg font-black text-sm"
                          style={{
                            background:
                              m.grade === "A+" ? "linear-gradient(180deg,#052e18,#083421)" :
                              m.grade === "A" ? "linear-gradient(180deg,#061a3a,#092045)" :
                              "#071427",
                            color:
                              m.grade === "A+" ? "#34d399" :
                              m.grade === "A" ? "#93c5fd" : "#94a3b8",
                            border: "1px solid rgba(255,255,255,0.03)",
                            boxShadow: m.grade === "A+" ? "0 8px 40px rgba(16,185,129,0.12)" : m.grade === "A" ? "0 8px 40px rgba(79,70,229,0.12)" : "none"
                          }}
                        >
                          {m.grade}
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <StatusBadge status={m.status} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile export area + footer */}
          <div className="p-4 md:p-6 bg-[#071122] border-t border-[#122033] text-center">
            <button
              className="md:hidden w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-400 text-black font-bold"
              style={{ boxShadow: "0 8px 40px rgba(99,102,241,0.12)" }}
            >
              <Download size={16} /> Export Transcript
            </button>

            <p className="text-xs text-slate-400 mt-3">Last updated: November 25, 2025</p>
          </div>
        </div>

        {/* Grading Scale card */}
        <div className="rounded-2xl bg-[#0b1220] border border-[#1c273d] p-6 md:p-8 shadow-[0_18px_50px_rgba(6,22,48,0.6)]">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(180deg,#07122a,#0b1830)",
                boxShadow: "0 10px 40px rgba(99,102,241,0.16)"
              }}
            >
              <Award size={20} className="text-cyan-200" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Grading Scale</h3>
              <p className="text-sm text-slate-400">Official grade distribution & scale</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <ScaleCard grade="A+" range="95 - 100" tone="emerald" glow />
            <ScaleCard grade="A" range="90 - 94" tone="emerald" glow />
            <ScaleCard grade="B+" range="85 - 89" tone="indigo" glow />
            <ScaleCard grade="B" range="80 - 84" tone="indigo" glow />
            <ScaleCard grade="C+" range="75 - 79" tone="violet" glow />
            <ScaleCard grade="C" range="70 - 74" tone="violet" glow />
          </div>

          <div className="mt-6 pt-6 border-t border-[#122033] text-sm text-slate-400 flex flex-col md:flex-row md:justify-between gap-3">
            <div>Minimum passing grade: <strong className="text-white">70%</strong></div>
            <div>Grade point calculated on 4.0 scale</div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* -------------------------
   Subcomponents
   ------------------------- */

const StatCard = ({ title, value, icon, subtitle, accent = "cyan", glowStyle }) => {
  const accentColors = {
    cyan: { bg: "#06232b", fg: "#7dd3fc", ring: "#06b6d4" },
    emerald: { bg: "#06261d", fg: "#86efac", ring: "#34d399" },
    violet: { bg: "#1b0630", fg: "#c4b5fd", ring: "#7c3aed" },
    amber: { bg: "#2b1a04", fg: "#ffd580", ring: "#f59e0b" },
  };

  const col = accentColors[accent] || accentColors.cyan;

  return (
    <div
      className="rounded-2xl p-5 border border-[#122033] relative overflow-hidden"
      style={{ background: col.bg, boxShadow: glowStyle }}
    >
      <div className="flex items-start justify-between">
        <div className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.02)", boxShadow: `0 10px 40px ${col.ring}33` }}>
            {icon}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-300 uppercase">{title}</div>
            <div className="text-2xl md:text-3xl font-extrabold text-white mt-1">{value}</div>
          </div>
        </div>

        <div className="text-xs text-slate-300 hidden md:block">{subtitle}</div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  if (status === "Passed") {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold" style={{
        background: "linear-gradient(180deg,#052d1c,#083421)",
        color: "#34d399",
        boxShadow: "0 8px 30px rgba(16,185,129,0.12)",
        border: "1px solid rgba(52,211,153,0.12)"
      }}>
        <CheckCircle2 size={14} /> {status}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold" style={{
      background: "linear-gradient(180deg,#2b1800,#3a2200)",
      color: "#f59e0b",
      boxShadow: "0 8px 30px rgba(245,158,11,0.12)",
      border: "1px solid rgba(245,158,11,0.08)"
    }}>
      <Clock size={14} /> {status}
    </span>
  );
};

const ScaleCard = ({ grade, range, tone = "indigo", glow = false }) => {
  const toneMap = {
    emerald: { from: "#052e18", to: "#083421", fg: "#34d399", shadow: "rgba(16,185,129,0.14)" },
    indigo: { from: "#061a3a", to: "#092045", fg: "#93c5fd", shadow: "rgba(79,70,229,0.14)" },
    violet: { from: "#2a0f3a", to: "#3b1648", fg: "#c4b5fd", shadow: "rgba(139,92,246,0.12)" },
  };

  const t = toneMap[tone] || toneMap.indigo;

  return (
    <div className="rounded-xl p-4 text-center" style={{
      background: `linear-gradient(180deg, ${t.from}, ${t.to})`,
      boxShadow: glow ? `0 12px 40px ${t.shadow}` : "none",
      border: "1px solid rgba(255,255,255,0.03)"
    }}>
      <div className="text-2xl font-black" style={{ color: t.fg }}>{grade}</div>
      <div className="text-xs font-semibold" style={{ color: `${t.fg}cc` }}>{range}</div>
      <div className="text-[10px] uppercase font-bold mt-2" style={{ color: `${t.fg}88` }}>
        {grade === "A+" || grade === "A" ? "Top" : grade === "B+" ? "Very Good" : "Good"}
      </div>
    </div>
  );
};

export default MyGrades;
