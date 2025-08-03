import { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { NetworkTable } from './components/NetworkTable';
import { BlockedIPs } from './components/BlockedIPs';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LiveStats } from './components/LiveStats';
import Analytics from './pages/Analytics';
import SecurityRules from './pages/SecurityRules';
import NetworkMaps from './pages/NetworkMaps';
import SystemLogs from './pages/SystemLogs';
import Settings from './pages/Settings';
import About from './pages/About';
import type { 
  NetworkTraffic, 
  BlockedIP,
  NetworkNode, 
  NetworkConnection,
  NodeStatus,
  ConnectionStatus,
  Theme
} from './types';
import { 
  api, 
  SystemStatus, 
  APINetworkStats,
  NetworkTraffic as APINetworkTraffic
} from './utils/api';

// UI Configuration
const UI_CONFIG = {
  refreshInterval: 5000, // 5 seconds
  maxLogEntries: 100,
  defaultTheme: 'dark' as const,
};

function AppContent() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [pageTransition, setPageTransition] = useState(false);
  const location = useLocation();

  // Toggle between light and dark theme
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  // Add transition effect on route change and theme change
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // State for data from API
  const [networkTraffic, setNetworkTraffic] = useState<APINetworkTraffic | null>(null);
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [networkStats, setNetworkStats] = useState<APINetworkStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Derived state
  const bandwidth = useMemo(() => {
    if (!networkTraffic) return 0;
    // Calculate total bandwidth in Mbps
    const totalBytes = Object.values(networkTraffic.interfaces).reduce(
      (sum, iface) => sum + iface.bytes_sent + iface.bytes_recv, 0
    );
    return Math.round((totalBytes / 1024 / 1024) * 100) / 100; // Convert to Mbps
  }, [networkTraffic]);

  const activeConnections = useMemo(() => 
    networkStats?.active_connections || 0, 
    [networkStats]
  );

  const suspiciousActivities = useMemo(() => {
    if (!networkStats || !networkStats.interfaces) return [];
    
    // Convert interfaces object to array if it's an object
    const interfacesArray = Array.isArray(networkStats.interfaces) 
      ? networkStats.interfaces 
      : Object.values(networkStats.interfaces || {});
    
    return interfacesArray
      .filter(iface => iface && iface.is_up && (iface.speed > 0))
      .map(iface => 
        `Interface ${iface.name || 'unknown'} (${iface.ip_address || 'No IP'}) - ${iface.speed}Mbps`
      );
  }, [networkStats]);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch data in parallel
      const [
        trafficData, 
        blockedIPsData, 
        systemStatusData, 
        statsData
      ] = await Promise.all([
        api.getNetworkTraffic(),
        api.getBlockedIPs(),
        api.getSystemStatus(),
        api.getNetworkStats()
      ]);
      
      // Update state with fetched data
      setNetworkTraffic(trafficData);
      setBlockedIPs(blockedIPsData);
      setSystemStatus(systemStatusData);
      setNetworkStats(statsData);
      
      // Log for debugging
      console.log('Fetched network traffic:', trafficData);
      console.log('Fetched network stats:', statsData);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load system data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up auto-refresh
  useEffect(() => {
    // Initial fetch
    fetchData();
    
    // Set up refresh interval
    const intervalId = setInterval(() => {
      fetchData();
    }, UI_CONFIG.refreshInterval);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchData]);

  // Handle page transitions
  useEffect(() => {
    setPageTransition(true);
    const timer = setTimeout(() => setPageTransition(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Set up polling for real-time updates
  useEffect(() => {
    const updateData = async () => {
      try {
        const [trafficData, statsData] = await Promise.all([
          api.getNetworkTraffic(),
          api.getNetworkStats()
        ]);
        setNetworkTraffic(trafficData);
        setNetworkStats(statsData);
      } catch (err) {
        console.error('Error in real-time update:', err);
      }
    };

    const intervalId = setInterval(updateData, 5000); // Update every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  const handleRemoveIP = async (ip: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.UNBLOCK_IP(ip), {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to unblock IP');
      }

      // Refresh blocked IPs list
      const blockedIPsResponse = await fetch(API_ENDPOINTS.BLOCKED_IPS);
      const data = await blockedIPsResponse.json();
      setBlockedIPs(data);
    } catch (error) {
      console.error('Error removing IP:', error);
    }
  };

  const handleAddIP = async (ip: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.BLOCK_IP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip }),
      });

      if (!response.ok) {
        throw new Error('Failed to block IP');
      }

      // Refresh blocked IPs list
      const blockedIPsResponse = await fetch(API_ENDPOINTS.BLOCKED_IPS);
      const data = await blockedIPsResponse.json();
      setBlockedIPs(data);
    } catch (error) {
      console.error('Error adding IP:', error);
    }
  };

  return (
    <div className={`min-h-screen bg-background text-foreground ${theme === 'dark' ? 'dark' : ''}`}>
      <Header theme={theme} onThemeToggle={toggleTheme} />
      
      <main className={`
        container 
        mx-auto 
        px-4 sm:px-6 lg:px-8 2xl:px-12
        py-4 sm:py-6 lg:py-8 2xl:py-12 
        max-w-[2560px] 
        transition-opacity duration-200 
        ${pageTransition ? 'opacity-50' : 'opacity-100'}
      `}>
        {error && (
          <div className="mb-8 text-red-500 p-4 rounded-lg border border-red-200 bg-red-50">
            {error}
          </div>
        )}
        
        <Routes>
          <Route
            path="/"
            element={
              <div className="space-y-8 animate-fadeIn">
                <LiveStats 
                  networkTraffic={networkTraffic}
                  networkStats={networkStats}
                  systemStatus={systemStatus}
                  bandwidth={bandwidth}
                  suspiciousActivities={suspiciousActivities}
                  activeConnections={activeConnections}
                />
                <section id="monitoring">
                  <h2 className="mb-4 text-2xl font-bold">Live Network Monitoring</h2>
                  <NetworkTable traffic={networkTraffic} />
                </section>
                <section id="blocked">
                  <h2 className="mb-4 text-2xl font-bold">Blocked IPs</h2>
                  <BlockedIPs
                    blockedIPs={blockedIPs}
                    onRemoveIP={handleRemoveIP}
                    onAddIP={handleAddIP}
                  />
                </section>
              </div>
            }
          />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/network-maps" element={<NetworkMaps />} />
          <Route path="/system-logs" element={<SystemLogs />} />
          <Route path="/security-rules" element={<SecurityRules />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <footer className="border-t py-6">
        <div className="container flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div 
              className={`h-2 w-2 rounded-full ${
                !systemStatus
                  ? 'bg-gray-400' // Loading/unknown state
                  : systemStatus.status === 'connected' 
                  ? 'bg-green-500' 
                  : systemStatus.status === 'error'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`} 
            />
            <p className="text-sm text-muted-foreground">
              System Status: {systemStatus 
                ? `${systemStatus.status ? systemStatus.status.charAt(0).toUpperCase() + systemStatus.status.slice(1) : 'Unknown'}`
                : 'Loading...'}
              {systemStatus?.last_checked && (
                <span className="ml-2 text-xs">
                  (Last checked: {new Date(systemStatus.last_checked).toLocaleTimeString()})
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/abhishek-khadse/Sage-Shield.git"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center"
            >
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;