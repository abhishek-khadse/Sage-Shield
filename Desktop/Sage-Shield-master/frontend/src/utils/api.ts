import { API_ENDPOINTS } from '../config';

// API configuration
const API_PREFIX = '/api';

// Types
export interface NetworkTraffic {
  interfaces: Record<string, {
    bytes_sent: number;
    bytes_recv: number;
    packets_sent: number;
    packets_recv: number;
    errin: number;
    errout: number;
    dropin: number;
    dropout: number;
  }>;
  history: {
    timestamps: string[];
    bytes_sent: number[];
    bytes_recv: number[];
    packets_sent: number[];
    packets_recv: number[];
  };
  current_rate: {
    bytes_sent: number;
    bytes_recv: number;
    packets_sent: number;
    packets_recv: number;
    error_in: number;
    error_out: number;
    drop_in: number;
    drop_out: number;
  };
  timestamp: string;
}

export interface BlockedIP {
  ip: string;
  reason: string;
  timestamp: string;
  is_active: boolean;
  active_connections: number;
}

export interface SystemStatus {
  status: 'connected' | 'disconnected' | 'error';
  last_checked: string;
  uptime: number;
  cpu_usage: number;
  cpu_cores: number;
  cpu_freq: number | null;
  memory_usage: number;
  memory_total: number;
  memory_available: number;
  memory_used: number;
  swap_used: number;
  disk_usage: number;
  disk_total: number;
  disk_used: number;
  disk_free: number;
  network_interfaces: string[];
  active_processes: number;
  system: {
    os: string;
    release: string;
    version: string;
    machine: string;
    processor: string;
    hostname: string;
    ip_address: string;
  };
}

export interface APINetworkStats {
  total_connections: number;
  active_connections: number;
  bytes_sent: number;
  bytes_received: number;
  bytes_sent_rate: number;
  bytes_received_rate: number;
  packets_sent: number;
  packets_received: number;
  packets_sent_rate: number;
  packets_received_rate: number;
  error_count: number;
  drop_count: number;
  interfaces: Array<{
    name: string;
    ip_address: string | null;
    is_up: boolean;
    speed: number;
    mtu: number;
  }>;
  timestamp: string;
}

export const createEndpoint = (path: string): string => {
  if (!path) {
    console.error('Path is required for createEndpoint');
    return API_PREFIX;
  }
  
  // Clean up the path by removing leading/trailing slashes
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  
  return `${API_PREFIX}/${cleanPath}`;
};

/**
 * Enhanced fetch with timeout and better error handling
 * @param url The URL to fetch
 * @param options Fetch options
 * @param timeout Timeout in milliseconds (default: 10000)
 * @returns Promise with the parsed JSON response
 */
const fetchWithTimeout = async <T>(
  url: string, 
  options: RequestInit = {}, 
  timeout = 10000 // Increased default timeout to 10 seconds
): Promise<T> => {
  console.log(`[fetchWithTimeout] Starting request to ${url}`);
  const controller = new AbortController();
  let timeoutId: NodeJS.Timeout;

  try {
    // Set up timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        const error = new Error(`Request to ${url} timed out after ${timeout}ms`);
        console.warn(`[fetchWithTimeout] ${error.message}`);
        controller.abort();
        reject(error);
      }, timeout);
    });

    // Set up fetch request
    const fetchPromise = (async () => {
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
          }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          let errorData = {};
          try {
            errorData = await response.json();
          } catch (e) {
            console.warn('[fetchWithTimeout] Failed to parse error response as JSON');
          }
          
          const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
          (error as any).status = response.status;
          (error as any).data = errorData;
          throw error;
        }

        const data = await response.json();
        console.log(`[fetchWithTimeout] Successfully fetched from ${url}`);
        return data;
      } catch (error) {
        console.error(`[fetchWithTimeout] Error in fetch for ${url}:`, error);
        throw error;
      }
    })();

    // Race between fetch and timeout
    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch (error) {
    console.error(`[fetchWithTimeout] API Error for ${url}:`, error);
    
    // Handle different types of errors
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        const abortError = new Error(`Request to ${url} was aborted: ${error.message}`);
        abortError.name = 'AbortError';
        throw abortError;
      } else if (error.name === 'TypeError') {
        if (error.message.includes('Failed to fetch')) {
          const networkError = new Error(`Network error: Unable to connect to the server. Please check your connection.`);
          networkError.name = 'NetworkError';
          throw networkError;
        }
      }
    }
    
    // Re-throw the error if we don't have a specific handler for it
    throw error;
  } finally {
    // Ensure we always clear the timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};

// Helper function to transform blocked IPs to match the frontend's expected format
const transformBlockedIPs = (blockedIPs: any[]): BlockedIP[] => {
  return blockedIPs.map(ip => ({
    ip: ip.ip,
    reason: ip.reason,
    timestamp: ip.timestamp,
    is_active: ip.is_active || false,
    active_connections: ip.active_connections || 0
  }));
};

// Helper function to transform network traffic data
const transformNetworkTraffic = (traffic: any = {}): NetworkTraffic => {
  // Ensure traffic is an object to prevent undefined errors
  const safeTraffic = traffic || {};
  
  // Safely access nested properties with defaults
  return {
    interfaces: safeTraffic.interfaces || {},
    history: {
      timestamps: safeTraffic.history?.timestamps || [],
      bytes_sent: safeTraffic.history?.bytes_sent || [],
      bytes_recv: safeTraffic.history?.bytes_recv || [],
      packets_sent: safeTraffic.history?.packets_sent || [],
      packets_recv: safeTraffic.history?.packets_recv || []
    },
    current_rate: safeTraffic.current_rate || {
      bytes_sent: 0,
      bytes_recv: 0,
      packets_sent: 0,
      packets_recv: 0,
      error_in: 0,
      error_out: 0,
      drop_in: 0,
      drop_out: 0
    },
    timestamp: safeTraffic.timestamp || new Date().toISOString()
  };
};

// API Functions
export const api = {
  // Network Traffic
  async getNetworkTraffic(): Promise<NetworkTraffic> {
    const response = await fetchWithTimeout<any>(createEndpoint('network/traffic'));
    return transformNetworkTraffic(response);
  },

  // Blocked IPs
  async getBlockedIPs(): Promise<BlockedIP[]> {
    const response = await fetchWithTimeout<{ blocked_ips: Record<string, any> }>(createEndpoint('network/blocked-ips'));
    // Convert the object of IPs to an array of IP objects
    const blockedIPsArray = Object.entries(response.blocked_ips || {}).map(([ip, data]) => ({
      ip,
      reason: data.reason || 'No reason provided',
      timestamp: data.blocked_at || new Date().toISOString(),
      is_active: true,
      active_connections: 0
    }));
    return blockedIPsArray;
  },

  async blockIP(ip: string, reason: string): Promise<void> {
    await fetchWithTimeout(createEndpoint('network/blocked-ips'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip, reason })
    });
  },

  async unblockIP(ip: string): Promise<void> {
    await fetchWithTimeout(createEndpoint(`network/blocked-ips/${ip}`), {
      method: 'DELETE'
    });
  },

  // System Status
  async getSystemStatus(): Promise<SystemStatus> {
    return await fetchWithTimeout<SystemStatus>(createEndpoint('system/status'));
  },

  // Network Stats
  async getNetworkStats(): Promise<APINetworkStats> {
    return await fetchWithTimeout<APINetworkStats>(createEndpoint('network/stats'));
  },

  getAnalytics: async (timeRange: string = '24h') => {
    return fetchWithTimeout(createEndpoint(`analytics?range=${timeRange}`));
  },

  // Settings
  getSettings: async () => {
    return fetchWithTimeout(createEndpoint('settings'));
  },

  updateSettings: async (settings: any) => {
    return fetchWithTimeout(createEndpoint('settings'), {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  },

  // Security Rules
  getSecurityRules: async () => {
    return fetchWithTimeout(createEndpoint('security/rules'));
  },

  addSecurityRule: async (rule: any) => {
    return fetchWithTimeout(createEndpoint('security/rules'), {
      method: 'POST',
      body: JSON.stringify(rule),
    });
  },

  deleteSecurityRule: async (ruleId: string) => {
    return fetchWithTimeout(createEndpoint(`security/rules/${ruleId}`), {
      method: 'DELETE',
    });
  },

  // System Logs
  getSystemLogs: async (limit: number = 50) => {
    return fetchWithTimeout(createEndpoint(`system/logs?limit=${limit}`));
  },

  // Network Topology
  getNetworkTopology: async () => {
    return fetchWithTimeout(createEndpoint('network/topology'));
  },

  // Additional API methods
  getTraffic: async () => {
    return await fetchWithTimeout(API_ENDPOINTS.TRAFFIC);
  },

  getActiveConnections: async () => {
    return await fetchWithTimeout(API_ENDPOINTS.ACTIVE_CONNECTIONS);
  },

  getNetworkNodes: async () => {
    return await fetchWithTimeout(API_ENDPOINTS.NETWORK_NODES);
  },
}; 