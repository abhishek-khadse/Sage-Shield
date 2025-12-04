import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Preloader from './components/DashboardLoading';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute'; // Use the NEW FIXED version
import Login from './components/Login';
import { ToastProvider } from './components/common/Toast';

// Legal Pages
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';

// Main Pages
import Dashboard from './components/Dashboard';
import Courses from './components/Courses';
import Leaderboard from './components/Leaderboard';
import Challenges from './components/Challenges';
import CourseDetail from './components/CoursesDetails';

// Settings
import SettingsLayout from './components/settings/SettingLayout';
import MyProfile from './components/settings/MyProfile';
import MyGrades from './components/settings/MyGrades';
import AccountSettings from './components/settings/AccountSettings';
import Billing from './components/settings/Billing';
import HelpCenter from './components/settings/HelpCenter';

// Secure storage utilities
const secureStorage = {
  getToken: () => {
    try {
      return sessionStorage.getItem('auth_token');
    } catch (error) {
      return null;
    }
  },
  isTokenExpired: () => {
    const timestamp = sessionStorage.getItem('auth_timestamp');
    if (!timestamp) return true;
    const timeout = import.meta.env.VITE_SESSION_TIMEOUT || 86400000; 
    return Date.now() - parseInt(timestamp) > timeout;
  },
  clearAuth: () => {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_timestamp');
  }
};

// Layout
const AppLayout = ({ onLogout, user }) => {
  return (
    <div className="min-h-screen font-sans text-slate-900 flex flex-col relative">
      {/* Removed cyberpunk overlays for clarity */}
      {/* <div className="cyberpunk-bg"></div>
      <div className="cyberpunk-grid"></div>
      <div className="cyberpunk-particles">...</div> */}
      
      <Navbar onLogout={onLogout} user={user} />
      <main className="flex-grow pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  // 1. STATE: Start unauthenticated by default
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  // 2. STATE: New "Checking" state to block UI while validating token
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // 3. STATE: Visual loader for login transitions
  const [isLoading, setIsLoading] = useState(false);

  // --- VALIDATION LOGIC ---
  const validateToken = useCallback(async (token) => {
    if (!token || secureStorage.isTokenExpired()) {
      secureStorage.clearAuth();
      return null;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        secureStorage.clearAuth();
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Validation Error', error);
      secureStorage.clearAuth();
      return null;
    }
  }, []);

  // --- INITIAL LOAD & PERIODIC CHECK ---
  useEffect(() => {
    const initAuth = async () => {
      const token = secureStorage.getToken();
      
      if (token) {
        const userData = await validateToken(token);
        if (userData) {
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      
      // CRITICAL: We are done checking. Now we can render the Router.
      setIsCheckingAuth(false);
    };

    initAuth();

    // Periodic Check (every 60s is usually enough)
    const interval = setInterval(async () => {
      const token = secureStorage.getToken();
      if (token) {
        const userData = await validateToken(token);
        if (!userData) {
          // Token became invalid/expired during session
          handleLogout(); 
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [validateToken]);

  // --- HANDLERS ---
  const handleLogin = async () => {
    setIsLoading(true); // Start visual preloader
    
    // Quick re-validate to get user data
    const token = secureStorage.getToken();
    const userData = await validateToken(token);
    
    if (userData) {
      setIsAuthenticated(true);
      setUser(userData);
      // Keep preloader for 2s for effect, then remove
      setTimeout(() => setIsLoading(false), 2000);
    } else {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    secureStorage.clearAuth();
    setIsAuthenticated(false);
    setUser(null);
    setIsLoading(false);
  };

  if (isCheckingAuth) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-indigo-400 font-mono text-xs animate-pulse">VERIFYING SECURE CONNECTION...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      {/* Visual Preloader (for login transition) */}
      {isLoading && <Preloader />}

      {!isLoading && (
        <Router>
          <Routes>
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />

            {/* Public Routes (accessible without login) */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/challenges" element={<Challenges />} />

            <Route 
              path="/login"
              element={
                isAuthenticated
                  ? <Navigate to="/" replace />
                  : <Login onLogin={handleLogin} />
              }
            />

            {/* Settings always accessible for UI dev */}
            <Route element={<AppLayout onLogout={handleLogout} user={user} />}>
              <Route path="/settings" element={<SettingsLayout />}>
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<MyProfile />} />
                <Route path="grades" element={<MyGrades />} />
                <Route path="account" element={<AccountSettings />} />
                <Route path="billing" element={<Billing />} />
                <Route path="help" element={<HelpCenter />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      )}
    </ToastProvider>
  );
}

export default App;