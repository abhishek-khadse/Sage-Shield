import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Target,
  Bell,
  Settings,
  LogOut,
  User,
  CreditCard,
  HelpCircle,
  Wallet,
} from "lucide-react";

/**
 * Optimized Navbar (GI3-A: Electric Blue Core)
 * - Inline glow utilities (no tailwind.config changes)
 * - Reusable subcomponents
 * - Reduced repeated classes and styles
 * - Props: onLogout(user from App), user
 *
 * Paste & run. No external config required.
 */

/* ---------- Glow & style tokens (inline) ---------- */
const TOKENS = {
  bg: "#050611",
  surface: "#0b1220",
  cardBorder: "#1c273d",
  neonBlue: "#4C8BFF",
  neonPurple: "#8F5BFF",
  subtleText: "text-slate-400",
  primaryText: "text-slate-100",
  neonGlow: "0 6px 24px rgba(76,139,255,0.14)",
  navShadow: "0 8px 32px rgba(0,0,0,0.7)",
};

const baseNavClasses =
  "relative flex items-center justify-between w-full max-w-7xl h-20 px-6 rounded-2xl transition-all duration-300";

/* small helper to conditionally join classes */
const cx = (...args) => args.filter(Boolean).join(" ");

/* ---------- Secure storage helpers (unchanged but kept local) ---------- */
const secureStorage = {
  getToken: () => {
    try {
      return sessionStorage.getItem("auth_token");
    } catch (error) {
      console.error("Failed to retrieve token:", error);
      return null;
    }
  },
  clearAuth: () => {
    try {
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_timestamp");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_timestamp");
    } catch (error) {
      console.error("Failed to clear auth storage:", error);
    }
  },
};

const Navbar = ({ onLogout, user }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.walletAddress) {
      setWalletAddress(user.walletAddress);
    } else {
      const storedUser = sessionStorage.getItem("user_data");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setWalletAddress(parsed.walletAddress || "");
        } catch (e) {
          console.error("Failed to parse stored user data:", e);
        }
      }
    }
  }, [user]);

  // close dropdowns on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const toggleDropdown = useCallback((name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  }, []);

  const closeDropdown = useCallback(() => setActiveDropdown(null), []);

  const handleLogout = useCallback(() => {
    closeDropdown();
    secureStorage.clearAuth();
    if (onLogout) onLogout();
    navigate("/login");
  }, [onLogout, navigate, closeDropdown]);

  const formatAddress = (addr) => {
    if (!addr) return "0x…";
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
  };

  const copyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress);
        // small UX improvement: you can add a toast here
      } catch (e) {
        console.error("Clipboard failed:", e);
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 px-4">
      <nav
        ref={navRef}
        className={cx(baseNavClasses)}
        style={{
          background: `linear-gradient(180deg, rgba(10,14,22,0.85), rgba(6,8,12,0.7))`,
          border: `1px solid ${TOKENS.cardBorder}`,
          boxShadow: `${TOKENS.navShadow}, 0 0 30px rgba(76,139,255,0.06)`,
          backdropFilter: "saturate(110%) blur(6px)",
        }}
      >
        {/* LEFT: Logo */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-3 cursor-pointer transition-transform transform hover:scale-105"
            aria-label="Home"
          >
            <img
              src="/image/AlbusSecurityLogoBlack.jpg"
              alt="Albus Security"
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        {/* CENTER: Nav Pills (hidden on small screens) */}
        <div className="hidden md:flex items-center gap-1 p-1.5 rounded-xl bg-slate-900/40 border border-slate-800/60 shadow-inner">
          <NavPill
            to="/"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            currentPath={location.pathname}
            neonColor={TOKENS.neonBlue}
          />
          <NavPill to="/courses" icon={<BookOpen size={18} />} label="My Courses" currentPath={location.pathname} neonColor={TOKENS.neonBlue} />
          <NavPill to="/leaderboard" icon={<Trophy size={18} />} label="Leaderboard" currentPath={location.pathname} neonColor={TOKENS.neonBlue} />
          <NavPill to="/challenges" icon={<Target size={18} />} label="Challenges" currentPath={location.pathname} neonColor={TOKENS.neonBlue} />
        </div>

        {/* RIGHT: action cluster */}
        <div className="flex items-center gap-3">
          {/* Settings Dropdown */}
          <div className="relative">
            <IconButton
              onClick={() => toggleDropdown("settings")}
              isActive={activeDropdown === "settings"}
              neonColor={TOKENS.neonBlue}
              ariaLabel="Open system settings"
            >
              <Settings size={20} />
            </IconButton>

            <DropdownMenu isOpen={activeDropdown === "settings"}>
              <DropdownItem to="/settings/account" icon={<User size={16} />} label="Account Settings" onClick={closeDropdown} />
              <DropdownItem to="/settings/billing" icon={<CreditCard size={16} />} label="Billing" onClick={closeDropdown} />
              <DropdownItem to="/settings/help" icon={<HelpCircle size={16} />} label="Help Center" onClick={closeDropdown} />
            </DropdownMenu>
          </div>

          {/* Notifications */}
          <div className="relative">
            <IconButton
              onClick={() => toggleDropdown("notifications")}
              isActive={activeDropdown === "notifications"}
              neonColor={TOKENS.neonBlue}
              badge
              ariaLabel="Toggle notifications"
            >
              <Bell size={20} />
            </IconButton>

            <DropdownMenu isOpen={activeDropdown === "notifications"}>
              <div className="px-4 py-3 flex items-center justify-between border-b border-slate-800/60 bg-slate-900/60">
                <span className="font-bold text-sm text-slate-100">Notifications</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-black">2 New</span>
              </div>

              <div className="max-h-64 overflow-y-auto p-2">
                <NotificationItem title="Course Completed" desc="You finished 'Intro to React'." time="Just now" isNew />
                <NotificationItem title="New Challenge" desc="Weekly CTF challenge is live." time="2h ago" />
              </div>
            </DropdownMenu>
          </div>

          <div className="h-8 w-px bg-slate-700 mx-1" />

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("profile")}
              className="flex items-center gap-3 pl-1 pr-1 py-1 rounded-full hover:bg-slate-800/40 transition-all border border-transparent hover:border-indigo-400/20"
              aria-haspopup="true"
              aria-expanded={activeDropdown === "profile"}
              aria-label="Open profile menu"
            >
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                alt={user?.username || "Profile"}
                className={cx(
                  "h-10 w-10 rounded-full object-cover border-2",
                  activeDropdown === "profile" ? "ring-2" : "ring-0"
                )}
                style={{
                  borderColor: "rgba(255,255,255,0.03)",
                  boxShadow: activeDropdown === "profile" ? `0 6px 24px rgba(76,139,255,0.14)` : "none",
                }}
              />
              <div className="hidden lg:block text-left mr-2">
                <div className="text-sm font-bold text-slate-100">{user?.username || formatAddress(walletAddress)}</div>
                <div className="text-[10px] uppercase tracking-wide text-slate-500">Student</div>
              </div>
            </button>

            <DropdownMenu isOpen={activeDropdown === "profile"}>
              <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-900/60">
                <p className="text-sm font-bold text-slate-100">{user?.username || formatAddress(walletAddress)}</p>
                <p className="text-xs text-slate-500 font-mono">{formatAddress(walletAddress)}</p>
              </div>

              <div className="p-1">
                <DropdownItem to="/settings/profile" icon={<User size={16} />} label="My Profile" onClick={closeDropdown} />
                <DropdownItem to="/settings/grades" icon={<Trophy size={16} />} label="My Grades" onClick={closeDropdown} />
                <div
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 cursor-pointer transition-colors"
                  onClick={copyAddress}
                >
                  <Wallet size={16} /> Copy Wallet Address
                </div>

                <div className="h-px bg-slate-800 my-1" />

                <DropdownItem icon={<LogOut size={16} />} label="Log Out" danger onClick={handleLogout} />
              </div>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </div>
  );
};

/* ----------------- Subcomponents ----------------- */

const NavPill = ({ to, icon, label, currentPath, neonColor }) => {
  const isActive = currentPath === to;
  const activeBg = "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800";
  const inactive = "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80";

  return (
    <Link
      to={to}
      className={cx(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-transform duration-150",
        isActive ? cx(activeBg, "text-slate-100 scale-[1.03]") : inactive
      )}
      style={
        isActive
          ? {
              boxShadow: `0 6px 20px ${neonColor}22, 0 2px 12px ${neonColor}22`,
              border: `1px solid rgba(76,139,255,0.12)`,
            }
          : {}
      }
      aria-current={isActive ? "page" : undefined}
    >
      <span className={isActive ? "text-[--accent]" : "text-slate-400"} style={isActive ? { color: neonColor } : {}}>
        {icon}
      </span>
      <span className="relative z-10">{label}</span>
    </Link>
  );
};

const IconButton = ({ children, onClick, isActive, badge, neonColor, ariaLabel }) => {
  const base = "relative p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center";
  return (
    <button
      onClick={onClick}
      className={cx(
        base,
        isActive
          ? "text-slate-100 scale-105"
          : "text-slate-400 hover:text-slate-100 hover:-translate-y-0.5"
      )}
      aria-label={ariaLabel}
      style={
        isActive
          ? { boxShadow: `0 8px 30px ${neonColor}22, 0 2px 12px ${neonColor}22`, border: `1px solid ${neonColor}22` }
          : {}
      }
    >
      <span className="relative z-10">{children}</span>
      {badge && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-slate-900 animate-pulse" />}
    </button>
  );
};

const DropdownMenu = ({ isOpen, children }) => {
  return (
    <div
      className={cx(
        "absolute top-full right-0 mt-4 w-56 rounded-2xl overflow-hidden transition-all duration-200 origin-top-right z-50",
        isOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
      )}
      role="menu"
    >
      <div style={{ background: "rgba(7,10,14,0.72)", border: `1px solid ${TOKENS.cardBorder}`, backdropFilter: "blur(6px)" }}>
        {children}
      </div>
    </div>
  );
};

const DropdownItem = ({ icon, label, to, onClick, danger = false }) => {
  const base = "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors font-semibold";
  const dangerCls = danger ? "text-rose-400 hover:bg-rose-500/10 hover:text-rose-300" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100";
  if (to) {
    return (
      <Link to={to} className={cx(base, dangerCls)} onClick={onClick}>
        <span className="text-slate-300">{icon}</span>
        {label}
      </Link>
    );
  }
  return (
    <button className={cx(base, dangerCls)} onClick={onClick}>
      <span className="text-slate-300">{icon}</span>
      {label}
    </button>
  );
};

const NotificationItem = ({ title, desc, time, isNew }) => {
  return (
    <div className="flex gap-3 p-3 hover:bg-slate-800/40 rounded-xl transition-all duration-200 cursor-pointer">
      <div className={cx("mt-1 h-2 w-2 rounded-full shrink-0", isNew ? "bg-blue-400 ring-2 ring-blue-400/20" : "bg-slate-700")} />
      <div>
        <h4 className="text-sm font-bold text-slate-100">{title}</h4>
        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
        <p className="text-[10px] text-slate-600 mt-1">{time}</p>
      </div>
    </div>
  );
};

export default Navbar;
