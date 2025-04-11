const BACKEND_URL = `https://sage-shield.onrender.com/api`;

export const API_ENDPOINTS = {
    ANALYTICS: `${BACKEND_URL}/analytics`,
    TRAFFIC: `${BACKEND_URL}/traffic`,
    BLOCKED_IPS: `${BACKEND_URL}/blocked-ips`,
    ACTIVE_CONNECTIONS: `${BACKEND_URL}/active-connections`,
    BLOCK_IP: `${BACKEND_URL}/block-ip`,
    UNBLOCK_IP: (ip: string) => `${BACKEND_URL}/unblock-ip/${ip}`,
    SETTINGS: `${BACKEND_URL}/settings`,
    NETWORK_NODES: `${BACKEND_URL}/network/nodes`,
    NETWORK_STATS: `${BACKEND_URL}/network/stats`,
    HEALTH: `${BACKEND_URL}/system/health`
};

// UI Configuration
export const UI_CONFIG = {
    TABLE: {
        MAX_HEIGHT: 600,
        MAX_ENTRIES: 1000,
        REFRESH_INTERVAL: 5000, // 5 seconds
        COLORS: {
            SUSPICIOUS: {
                TEXT: {
                    LIGHT: 'text-red-600',
                    DARK: 'text-red-400'
                },
                BACKGROUND: {
                    LIGHT: 'bg-red-50/50',
                    DARK: 'bg-red-900/10'
                }
            },
            NORMAL: {
                TEXT: {
                    LIGHT: 'text-green-600',
                    DARK: 'text-green-400'
                }
            },
            SCROLLBAR: {
                THUMB: {
                    DEFAULT: 'primary/20',
                    HOVER: 'primary/40',
                    DARK: {
                        DEFAULT: 'primary/40',
                        HOVER: 'primary/60'
                    }
                }
            }
        }
    }
}; 