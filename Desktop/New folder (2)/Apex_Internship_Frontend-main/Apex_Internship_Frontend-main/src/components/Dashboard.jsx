import React from "react";
import { motion } from "framer-motion";
import {
  Play,
  Clock,
  Calendar,
  ArrowUpRight,
  Mail,
  Video,
  FileText,
  BarChart3,
  BookOpen,
  TrendingUp,
  Target,
  Award,
  CheckCircle2,
  Activity,
  ChevronRight,
  Library,
} from "lucide-react";

/* ---------------------------------------------
   ANIMATION VARIANTS
---------------------------------------------- */
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

/* ---------------------------------------------
   MAIN DASHBOARD
---------------------------------------------- */
export default function Dashboard() {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1650px] px-8 space-y-8">
        <DashboardContent />
      </div>
    </div>
  );
}

function DashboardContent() {
  return (
    <motion.div
      className="min-h-screen space-y-8 mt-10 pb-16"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {/* HEADER ------------------------------------- */}
      <Header />

      {/* KPI CARDS ---------------------------------- */}
      <StatsRow />

      {/* LAYOUT: MAIN + SIDEBAR ---------------------- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <CurrentModuleCard />
          <AssignmentsTable />
        </div>

        <div className="space-y-8">
          <MentorCard />
          <UpcomingSessionsCard />
        </div>
      </div>
    </motion.div>
  );
}


/* ---------------------------------------------
   HEADER
---------------------------------------------- */
const Header = () => (
  <div className="flex items-center justify-between border-b border-slate-700/50 pb-5">
    <div>
      <h1 className="text-2xl font-bold text-primary">Dashboard Overview</h1>
      <p className="text-sm text-secondary">Track your progress and upcoming tasks</p>
    </div>

    <div className="text-right">
      <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Today</p>
      <p className="text-base font-bold text-primary">Monday, Oct 21</p>
    </div>
  </div>
);

/* ---------------------------------------------
   KPI SECTION
---------------------------------------------- */
const StatsRow = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard
      label="Performance Score"
      value="940"
      change="+12 this week"
      trend="up"
      icon={<BarChart3 size={20} />}
    />
    <StatCard
      label="Active Tasks"
      value="4"
      change="2 due soon"
      trend="neutral"
      icon={<Target size={20} />}
    />
    <StatCard
      label="Course Progress"
      value="65%"
      change="15/23 completed"
      trend="up"
      icon={<Activity size={20} />}
      linkPath="/resources"
    />
    <StatCard
      label="Knowledge Base"
      value="Resources"
      icon={<Library size={20} />}
      isActionCard
      buttonText="Access Resources"
    />
  </div>
);

/* ---------------------------------------------
   STAT CARD COMPONENT
---------------------------------------------- */
const StatCard = ({
  label,
  value,
  change,
  trend,
  icon,
  linkPath,
  isActionCard,
  buttonText,
}) => {
  const Wrapper = linkPath ? motion.a : motion.div;

  const trends = {
    up: "text-emerald-400",
    neutral: "text-secondary",
  };

  return (
    <Wrapper
      variants={item}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-6 rounded-2xl cyberpunk-card border transition-all duration-300 group cursor-pointer
        ${isActionCard
          ? "border-blue-400/30 hover:border-blue-500/50"
          : "hover:border-slate-600/50"
        }
      `}
      href={linkPath}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl glass-panel icon-neon border-slate-600/50 group-hover:scale-110 transition">
          {icon}
        </div>

        {!isActionCard && trend === "up" && (
          <TrendingUp size={16} className="text-emerald-400" />
        )}
      </div>

      <div>
        <p className="text-xs font-bold text-secondary uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-black text-primary tracking-tight">{value}</h3>

        {!isActionCard ? (
          <p className={`text-xs font-semibold ${trends[trend]}`}>{change}</p>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full mt-3 btn-neon text-xs font-bold rounded-xl flex items-center justify-between"
          >
            {buttonText}
            <ArrowUpRight size={14} />
          </motion.button>
        )}
      </div>
    </Wrapper>
  );
};

/* ---------------------------------------------
   CURRENT MODULE CARD
---------------------------------------------- */
const CurrentModuleCard = () => (
  <motion.div
    variants={item}
    className="cyberpunk-card p-6 overflow-hidden hover:shadow-blue-glow transition-all"
  >
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 glass-panel rounded-lg">
            <BookOpen size={20} className="icon-neon" />
          </div>
          <div>
            <h2 className="text-base font-bold text-primary">Current Module</h2>
            <p className="text-xs text-secondary">Continue where you left off</p>
          </div>
        </div>

        <span className="badge-neon info px-3 py-1 text-xs font-semibold rounded-md">Module 4</span>
      </div>
    </div>

    <div className="p-6">
      <h3 className="text-xl font-bold text-primary mb-1.5">Advanced Penetration Testing</h3>

      <div className="flex items-center gap-4 text-sm text-secondary mb-6">
        <Clock size={14} className="icon-neon" />
        <span>1h 15m remaining</span>
        <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
        <span>Buffer Overflows & Memory Corruption</span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-secondary uppercase">Progress</span>
          <span className="text-sm font-bold text-primary">65%</span>
        </div>

        <div className="progress-neon">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "65%" }}
            transition={{ duration: 1 }}
            className="progress-neon-fill"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-700/50 pt-4">
        <div className="flex items-center gap-4 text-xs text-secondary">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-400" /> 15 of 23 videos
          </span>

          <span className="flex items-center gap-1.5">
            <Award size={14} className="text-amber-400" /> 3 quizzes passed
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          className="btn-neon px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <Play size={16} fill="currentColor" /> Resume Learning
        </motion.button>
      </div>
    </div>
  </motion.div>
);

/* ---------------------------------------------
   ASSIGNMENTS TABLE
---------------------------------------------- */
const AssignmentsTable = () => (
  <motion.div variants={item} className="cyberpunk-card p-6 overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <FileText size={18} className="icon-neon" />
        <h2 className="text-base font-bold text-primary">Active Assignments</h2>
      </div>

      <button className="text-sm font-semibold text-neon-blue hover:text-neon-purple">
        View All
      </button>
    </div>

    <table className="table-cyberpunk w-full">
      <thead>
        <tr className="border-b border-slate-700/50">
          {["Assignment", "Due Date", "Status", "Action"].map((h) => (
            <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-neon-blue uppercase tracking-wider">{h}</th>
          ))}
        </tr>
      </thead>

      <motion.tbody variants={container}>
        <AssignmentRow
          title="Vulnerability Assessment Report"
          due="Oct 24, 2024"
          status="In Progress"
          statusColor="badge-neon info"
          priority="high"
        />
        <AssignmentRow
          title="Python Automation Script"
          due="Oct 26, 2024"
          status="Under Review"
          statusColor="badge-neon warning"
          priority="medium"
        />
        <AssignmentRow
          title="Firewall Configuration Lab"
          due="Oct 20, 2024"
          status="Completed"
          statusColor="badge-neon success"
          priority="low"
        />
      </motion.tbody>
    </table>
  </motion.div>
);

/* ROW COMPONENT */
const AssignmentRow = ({ title, due, status, statusColor, priority }) => {
  const priorities = {
    high: "bg-red-500",
    medium: "bg-amber-400",
    low: "bg-slate-600",
  };

  return (
    <motion.tr variants={item} className="hover:bg-slate-700/30 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${priorities[priority]}`} />
          <span className="font-medium text-sm text-primary">{title}</span>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className="text-xs text-secondary">{due}</span>
      </td>

      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-md text-[10px] font-semibold uppercase ${statusColor}`}>
          {status}
        </span>
      </td>

      <td className="px-6 py-4 text-right">
        <motion.button whileHover={{ scale: 1.1 }}>
          <ArrowUpRight size={18} className="icon-neon text-secondary hover:text-neon-blue" />
        </motion.button>
      </td>
    </motion.tr>
  );
};

/* ---------------------------------------------
   MENTOR CARD
---------------------------------------------- */
const MentorCard = () => (
  <motion.div variants={item} className="cyberpunk-card p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider">
        Assigned Mentor
      </h2>

      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
        <span className="text-xs text-emerald-400">Online</span>
      </div>
    </div>

    <div className="flex items-start gap-3 mb-4">
      <img
        src="https://media.licdn.com/dms/image/v2/D5603AQGmaD34-rZnfw/profile-displayphoto-scale_100_100/B56Zfv8aanGUAg-/0/1752077287096?e=1765411200&v=beta&t=HJQ8Cyws4fMFcwS1d4kRrJKdAGHVnklzW1VW_p6GnVw"
        className="w-12 h-12 rounded-lg object-cover border border-slate-600/50"
      />

      <div>
        <h3 className="font-bold text-primary">Aniket Tyagi</h3>
        <p className="text-xs text-secondary">Lead Security Engineer</p>

        <div className="flex items-center gap-1.5 mt-1 text-xs text-secondary">
          <Activity size={12} className="icon-neon" />
          Available for consultation
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2">
      <ActionSmall icon={<Video size={14} />} text="Schedule Call" />
      <ActionSmall icon={<Mail size={14} />} text="Send Message" />
    </div>
  </motion.div>
);

const ActionSmall = ({ icon, text }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    className="glass-panel px-3 py-2.5 rounded-lg text-xs font-semibold text-secondary hover:text-primary flex items-center justify-center gap-2"
  >
    {icon}
    {text}
  </motion.button>
);

/* ---------------------------------------------
   UPCOMING SESSIONS CARD
---------------------------------------------- */
const UpcomingSessionsCard = () => (
  <motion.div variants={item} className="cyberpunk-card p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider">
        Upcoming Sessions
      </h2>

      <Calendar size={16} className="icon-neon" />
    </div>

    <motion.div className="space-y-3" variants={container}>
      <SessionRow date="Oct 12" title="1:1 Code Review Session" time="4:00 PM – 5:00 PM" />
      <SessionRow active date="Oct 14" title="Web Security Workshop" time="2:00 PM – 4:00 PM" />
      <SessionRow date="Oct 28" title="Career Portfolio Review" time="10:00 AM – 11:00 AM" />
    </motion.div>

    <button className="w-full mt-4 pt-3 border-t border-slate-700/50 text-sm text-neon-blue hover:text-neon-purple flex items-center justify-center gap-1">
      View Full Calendar <ChevronRight size={14} />
    </button>
  </motion.div>
);

const SessionRow = ({ date, title, time, active }) => (
  <motion.div
    variants={item}
    whileHover={{ x: 3 }}
    className={`flex items-start gap-3 p-3 rounded-lg border transition cursor-pointer 
      ${active ? "bg-blue-500/10 border-blue-400/30" : "bg-slate-700/20 border-slate-600/50"}
    `}
  >
    <div className={`min-w-[60px] text-center py-2 px-3 rounded-lg border glass-panel`}>
      <p className={`text-sm font-bold ${active ? "text-neon-blue" : "text-primary"}`}>{date}</p>
    </div>

    <div className="flex-1">
      <h4 className={`text-sm font-semibold ${active ? "text-neon-blue" : "text-primary"}`}>
        {title}
      </h4>

      <div className="flex items-center gap-1.5 text-xs text-secondary">
        <Clock size={12} className="icon-neon" />
        {time}
      </div>
    </div>
  </motion.div>
);
