// Courses.jsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield,
  Globe,
  Code,
  Terminal,
  Database,
  Briefcase,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  Play,
  TrendingUp,
  Clock,
  ChevronRight
} from "lucide-react";

/**
 * Courses.jsx
 * - Dark UI focused, improved visual hierarchy
 * - Animated progress bars (framer-motion)
 * - Hover states, tooltips for locked cards, percentage text
 *
 * Assumes Tailwind CSS is available in the project.
 */

/* -------------------- Animation Variants -------------------- */
const containerVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.06, delayChildren: 0.06 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 16 }
  }
};

/* -------------------- Helper / Data -------------------- */
const baseCourses = [
  {
    title: "Cyber Security Fundamentals",
    code: "CS-101",
    status: "Completed", // Completed | In Progress | Locked | Available
    progress: 100,
    icon: "shield",
    lessons: 24,
    completedLessons: 24,
    duration: "12h"
  },
  {
    title: "Networking Essentials",
    code: "NT-102",
    status: "In Progress",
    progress: 65,
    icon: "globe",
    lessons: 28,
    completedLessons: Math.round(28 * 0.65),
    duration: "14h"
  },
  {
    title: "Programming with Python",
    code: "PY-103",
    status: "Locked",
    progress: 0,
    icon: "code",
    lessons: 32,
    completedLessons: 0,
    duration: "16h",
    lockedReason: "Complete CS-101 to unlock"
  },
  {
    title: "Linux Fundamentals",
    code: "LX-104",
    status: "Locked",
    progress: 0,
    icon: "terminal",
    lessons: 20,
    completedLessons: 0,
    duration: "10h",
    lockedReason: "Complete the previous fundamentals to unlock"
  }
];

const iconMap = {
  shield: <Shield size={22} />,
  globe: <Globe size={22} />,
  code: <Code size={22} />,
  terminal: <Terminal size={22} />,
  database: <Database size={22} />
};

/* -------------------- Small UI Components -------------------- */

const SmallBadge = ({ children, className = "" }) => (
  <span
    className={`px-2 py-0.5 text-[11px] rounded-md font-semibold ${className}`}
    aria-hidden="true"
  >
    {children}
  </span>
);

/* Tiny tooltip component using title & aria (keeps it simple) */
const Tooltip = ({ children, tip }) => (
  <span title={tip} aria-label={tip} className="inline-block">
    {children}
  </span>
);

/* Module item row for specialization card */
const ModuleItem = ({ title }) => (
  <div className="flex items-center gap-2 p-2 rounded-md bg-slate-900/40 border border-slate-800">
    <div className="w-2 h-2 bg-slate-600 rounded-full" />
    <span className="text-xs text-slate-300">{title}</span>
  </div>
);

/* -------------------- Course Card -------------------- */
const CourseCard = ({
  title,
  code,
  status,
  progress,
  icon,
  lessons,
  completedLessons,
  duration,
  lockedReason
}) => {
  const isLocked = status === "Locked";
  const isCompleted = status === "Completed";
  const isInProgress = status === "In Progress";
  const isAvailable = status === "Available";

  // Accent color by state
  const accent =
    isCompleted ? "emerald" : isInProgress ? "violet" : isAvailable ? "sky" : "slate";

  const progressText = `${progress}% · ${completedLessons}/${lessons} lessons`;

  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ scale: isLocked ? 1.01 : 1.03 }}
      className={`relative bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between transition-shadow duration-200
        ${isLocked ? "opacity-60 pointer-events-auto" : "hover:shadow-xl hover:border-slate-700"}`
      }
      aria-labelledby={`card-${code}`}
    >
      <div>
        <div className="flex justify-between items-start gap-3">
          <div
            className={`p-2 rounded-lg inline-flex items-center justify-center ${
              isLocked ? "bg-slate-800 text-slate-400" :
              isCompleted ? "bg-emerald-900/40 text-emerald-400" :
              isInProgress ? "bg-violet-900/40 text-violet-400" :
              "bg-sky-900/40 text-sky-400"
            }`}
          >
            {/* slightly bigger icons */}
            <span className="text-[18px]">{iconMap[icon]}</span>
          </div>

          {/* Right top icons */}
          <div className="flex items-center gap-2">
            {isCompleted && (
              <div className="p-1 bg-emerald-900/40 rounded-md" title="Completed">
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
            )}

            {isLocked && (
              <Tooltip tip={lockedReason || "Locked"}>
                <div className="p-1 bg-slate-800 rounded-md" title={lockedReason || "Locked"}>
                  <Lock size={16} className="text-slate-400" />
                </div>
              </Tooltip>
            )}

            {isInProgress && (
              <div
                className="p-1 bg-violet-900/40 rounded-md"
                title="In progress"
              >
                <Play size={16} className="text-violet-400" />
              </div>
            )}
          </div>
        </div>

        <div className="mt-3">
          <div className="text-[11px] font-semibold text-slate-400 tracking-wider">{code}</div>
          <h3 id={`card-${code}`} className="mt-1 text-sm font-semibold text-slate-100">
            {title}
          </h3>

          <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <BookOpen size={12} />
              <span className="font-medium">{lessons}</span>
            </div>
            <div className="w-1 h-1 bg-slate-700 rounded-full" />
            <div className="flex items-center gap-2">
              <Clock size={12} />
              <span className="font-medium">{duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: animated progress + status + details */}
      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              {/* animated bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  isCompleted ? "bg-emerald-400" :
                  isInProgress ? "bg-violet-400" :
                  isAvailable ? "bg-sky-400" :
                  "bg-slate-700"
                }`}
              />
            </div>

            {/* progress text below the bar */}
            <div className="mt-1 text-xs text-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SmallBadge className={`${
                  isCompleted ? "bg-emerald-900/30 text-emerald-300 border border-emerald-800" :
                  isInProgress ? "bg-violet-900/30 text-violet-300 border border-violet-800" :
                  isAvailable ? "bg-sky-900/30 text-sky-300 border border-sky-800" :
                  "bg-slate-800 text-slate-400 border border-slate-700"
                }`}>
                  {status}
                </SmallBadge>

                <span className="text-[12px] font-medium text-slate-400" aria-hidden>
                  {progressText}
                </span>
              </div>

              {/* Details link */}
              <div>
                {!isLocked ? (
                  <Link
                    to={`/courses/${title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-xs text-slate-200 hover:text-white flex items-center gap-1"
                  >
                    Details <ChevronRight size={12} />
                  </Link>
                ) : (
                  <span className="text-xs text-slate-500">Locked</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

/* -------------------- Main Courses Component -------------------- */

const Courses = () => {
  // Here we simulate progressive unlocking:
  const updatedCourses = useMemo(() => {
    const copy = baseCourses.map((c) => ({ ...c }));
    for (let i = 1; i < copy.length; i++) {
      const prev = copy[i - 1];
      if (prev.status === "Completed" && copy[i].status === "Locked") {
        copy[i].status = "Available";
        copy[i].progress = 0;
      }
      if (prev.status !== "Completed" && copy[i].status !== "Locked" && copy[i].status !== "Available") {
        copy[i].status = "Locked";
        copy[i].progress = 0;
      }
    }
    return copy;
  }, []);

  const overallProgress = Math.round(
    updatedCourses.reduce((s, c) => s + c.progress, 0) / updatedCourses.length
  );

  const completedFundamentals = updatedCourses.filter((c) => c.status === "Completed").length;
  const specializationsUnlocked = completedFundamentals >= 2;

  return (
    <motion.section
      className="space-y-8 p-6 md:p-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <SmallBadge className="bg-indigo-900/50 text-indigo-300 border border-indigo-800">
              Internship Program
            </SmallBadge>
            <SmallBadge className="bg-emerald-900/50 text-emerald-300 border border-emerald-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block" />
              Active
            </SmallBadge>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-100 mb-2">Curriculum & Tracks</h1>
          <p className="text-slate-400 max-w-2xl">
            Complete fundamentals, choose your specialization, and launch your cyber career.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Progress</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="text-2xl font-extrabold text-sky-400">{overallProgress}%</div>
              <TrendingUp size={16} className="text-emerald-400" />
            </div>
            <div className="text-xs text-slate-400 mt-1">Overall course progress</div>
          </div>

          {/* Circular progress */}
          <div className="relative w-12 h-12">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" aria-hidden>
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#102027"
                strokeWidth="3.5"
              />
              <motion.path
                initial={{ strokeDashoffset: 100 }}
                animate={{ strokeDashoffset: 100 - overallProgress }}
                transition={{ duration: 0.7 }}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#grad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="grad" x1="0%" x2="100%">
                  <stop offset="0%" stopColor="#6b46c1" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Stage 1: Foundation Track */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-700 flex items-center justify-center text-white font-bold">1</div>
          <h2 className="text-lg font-bold text-slate-100">Foundation Track</h2>
          <SmallBadge className="bg-amber-900/40 text-amber-300 border border-amber-800">Required</SmallBadge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {updatedCourses.map((c) => (
            <CourseCard key={c.code} {...c} />
          ))}
        </div>
      </motion.div>

      {/* Stage 2: Specialization Path */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-700 flex items-center justify-center text-white font-bold">2</div>
          <h2 className="text-lg font-bold text-slate-100">Specialization Path</h2>
          <SmallBadge className="bg-purple-900/40 text-purple-300 border border-purple-800">Choose One</SmallBadge>
        </div>

        <div className={`${!specializationsUnlocked ? "opacity-60" : ""} grid grid-cols-1 lg:grid-cols-2 gap-5`}>
          <div className="relative bg-slate-900/40 border border-slate-800 rounded-xl p-5 h-full flex flex-col">
            {!specializationsUnlocked && (
              <div className="absolute inset-0 bg-slate-900/70 rounded-xl flex items-center justify-center z-10">
                <div className="text-center">
                  <Lock size={28} className="mx-auto text-slate-400 mb-3" />
                  <p className="text-slate-300 font-semibold">Complete 2 foundation courses to unlock</p>
                </div>
              </div>
            )}

            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-slate-800 text-slate-300">
                  <Globe size={20} />
                </div>
                <div>
                  <h3 className="text-slate-100 font-semibold text-base">Web Security & VAPT</h3>
                  <p className="text-slate-400 text-xs">OWASP, Burp Suite, Web Pentesting</p>
                </div>
              </div>

              <SmallBadge className="bg-indigo-900/30 text-indigo-300 border border-indigo-800">Track A</SmallBadge>
            </div>

            <div className="space-y-3 mb-4">
              <ModuleItem title="Web Development Fundamentals" />
              <ModuleItem title="Web Security & VAPT" />
            </div>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2"><BookOpen size={12} /><span className="font-semibold">2 Modules</span></div>
                <div className="flex items-center gap-2"><Clock size={12} /><span className="font-semibold">28h</span></div>
              </div>
              <Link to={specializationsUnlocked ? "/track/web-security-track" : "#"}>
                <motion.button
                  whileHover={{ scale: specializationsUnlocked ? 1.03 : 1 }}
                  className={`px-4 py-2 rounded-xl font-semibold text-xs transition-colors ${
                    specializationsUnlocked
                      ? "bg-gradient-to-r from-violet-500 to-sky-500 text-white"
                      : "bg-slate-800 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  View Track <ArrowRight size={14} className="inline-block ml-1" />
                </motion.button>
              </Link>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 h-full flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-slate-800 text-slate-300">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="text-slate-100 font-semibold text-base">Blockchain & Smart Contracts</h3>
                  <p className="text-slate-400 text-xs">DeFi, Solidity, Contract Auditing</p>
                </div>
              </div>

              <SmallBadge className="bg-purple-900/30 text-purple-300 border border-purple-800">Track B</SmallBadge>
            </div>

            <div className="space-y-3 mb-4">
              <ModuleItem title="Blockchain & DeFi Fundamentals" />
              <ModuleItem title="Solidity Development" />
              <ModuleItem title="Smart Contract Security" />
            </div>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2"><BookOpen size={12} /><span className="font-semibold">3 Modules</span></div>
                <div className="flex items-center gap-2"><Clock size={12} /><span className="font-semibold">36h</span></div>
              </div>
              <Link to={specializationsUnlocked ? "/track/blockchain-security-track" : "#"}>
                <motion.button
                  whileHover={{ scale: specializationsUnlocked ? 1.03 : 1 }}
                  className={`px-4 py-2 rounded-xl font-semibold text-xs transition-colors ${
                    specializationsUnlocked
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-slate-800 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  View Track <ArrowRight size={14} className="inline-block ml-1" />
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stage 3: Career Launch */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-slate-100 font-bold">3</div>
          <h2 className="text-lg font-bold text-slate-100">Career Launch</h2>
          <SmallBadge className="bg-slate-800/40 text-slate-300 border border-slate-700">Final Stage</SmallBadge>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-slate-300">
              <Briefcase size={22} />
            </div>

            <div>
              <h3 className="text-slate-100 font-semibold">Bug Bounty & Career Opportunities</h3>
              <p className="text-slate-400 text-sm">Real-world hunting, reports, and placement support.</p>
            </div>
          </div>

          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
            specializationsUnlocked ? "bg-emerald-900/30 text-emerald-300 border border-emerald-800" : "bg-slate-800 text-slate-400 border border-slate-700"
          }`}>
            <Lock size={14} /> {specializationsUnlocked ? "Unlocked" : "Locked"}
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Courses;
