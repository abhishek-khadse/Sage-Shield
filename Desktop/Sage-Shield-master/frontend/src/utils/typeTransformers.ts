import { NetworkTraffic as APINetworkTraffic, BlockedIP as APIBlockedIP } from '../utils/api';
import { NetworkTraffic, BlockedIP } from '../types/index';

// Define the extended BlockedIP interface locally to avoid type conflicts
interface ExtendedBlockedIP extends Omit<BlockedIP, 'duration'> {
  duration?: string;
}

/**
 * Transforms network traffic from API format to frontend format
 * @param traffic Network traffic in API format (from api.ts)
 * @returns Network traffic in frontend format (from types/index.ts)
 */
export const transformNetworkTraffic = (traffic: APINetworkTraffic | null | undefined): NetworkTraffic => {
  // Handle null/undefined input
  const safeTraffic = traffic || {} as APINetworkTraffic;
  
  // Convert timestamp from number to ISO string if needed
  const timestamp = typeof safeTraffic.timestamp === 'number' 
    ? new Date(safeTraffic.timestamp).toISOString() 
    : new Date(safeTraffic.timestamp || Date.now()).toISOString();
  
  // Map 'blocked' status to 'suspicious' to match the frontend type
  const status = safeTraffic.status === 'blocked' 
    ? 'suspicious' 
    : (safeTraffic.status === 'normal' || safeTraffic.status === 'suspicious' 
        ? safeTraffic.status 
        : 'normal') as 'normal' | 'suspicious';
  
  // Safely access properties with defaults
  const sourceIp = safeTraffic.source_ip || '0.0.0.0';
  const destinationIp = (safeTraffic as any).destination_ip || '0.0.0.0';
  const protocol = (safeTraffic as any).protocol || 'tcp';
  const bandwidth = typeof safeTraffic.bandwidth === 'number' ? safeTraffic.bandwidth : 0;
  const id = (safeTraffic as any).id || `traffic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Create the transformed object with the correct type
  return {
    id,
    source_ip: sourceIp,
    destination_ip: destinationIp,
    protocol: protocol,
    length: bandwidth,
    timestamp,
    status,
    bandwidth: bandwidth
  };
};

/**
 * Transforms a blocked IP from API format to frontend format
 * @param blockedIP Blocked IP in API format (from api.ts)
 * @returns Blocked IP in frontend format (from types/index.ts)
 */
export const transformBlockedIP = (blockedIP: APIBlockedIP): BlockedIP => {
  // Convert timestamp from number to ISO string if needed
  const timestamp = typeof blockedIP.timestamp === 'number' 
    ? new Date(blockedIP.timestamp).toISOString() 
    : new Date(blockedIP.timestamp || Date.now()).toISOString();
    
  return {
    ip: blockedIP.ip || '0.0.0.0',
    reason: blockedIP.reason || 'Suspicious activity',
    timestamp,
    duration: '1h' // Default duration as per the frontend interface
  };
};

/**
 * Transforms a list of API network traffic data to frontend format
 * @param trafficList Array of network traffic from API
 * @returns Transformed array of network traffic in frontend format
 */
export const transformNetworkTrafficList = (trafficList: APINetworkTraffic[] = []): NetworkTraffic[] => {
  if (!Array.isArray(trafficList)) {
    console.warn('Expected trafficList to be an array, got:', trafficList);
    return [];
  }
  
  return trafficList.map(traffic => {
    try {
      return transformNetworkTraffic(traffic);
    } catch (error) {
      console.warn('Error transforming network traffic:', error, traffic);
      
      // Create a safe default error object with all required NetworkTraffic properties
      const errorTraffic: NetworkTraffic = {
        id: 'error',
        source_ip: '0.0.0.0',
        destination_ip: '0.0.0.0',
        protocol: 'tcp',
        length: 0,
        timestamp: new Date().toISOString(),
        status: 'normal',
        bandwidth: 0
      };
      
      // If we have valid traffic data, try to preserve valid properties
      if (traffic && typeof traffic === 'object') {
        // Only copy properties that are defined in the NetworkTraffic type
        const validKeys: Array<keyof NetworkTraffic> = [
          'id', 'source_ip', 'destination_ip', 'protocol', 
          'length', 'timestamp', 'status', 'bandwidth'
        ] as const;
        
        for (const key of validKeys) {
          if (key in traffic && traffic[key as keyof APINetworkTraffic] !== undefined) {
            // @ts-ignore - We know these types are compatible
            errorTraffic[key] = traffic[key as keyof APINetworkTraffic];
          }
        }
      }
      
      return errorTraffic;
    }
  });
};

/**
 * Transforms a list of blocked IPs from API to frontend format
 * @param blockedIPs Array of blocked IPs from API
 * @returns Transformed array of blocked IPs in frontend format
 */
/**
 * Transforms a list of blocked IPs from API to frontend format
 * @param blockedIPs Array of blocked IPs from API
 * @returns Transformed array of blocked IPs in frontend format
 */
export const transformBlockedIPList = (blockedIPs: APIBlockedIP[] = []): BlockedIP[] => {
  if (!Array.isArray(blockedIPs)) {
    console.warn('Expected blockedIPs to be an array, got:', blockedIPs);
    return [];
  }
  
  return blockedIPs.map(ip => {
    try {
      return transformBlockedIP(ip);
    } catch (error) {
      console.error('Error transforming blocked IP:', error, ip);
      // Return a safe default that matches the BlockedIP interface
      return {
        ip: '0.0.0.0',
        reason: 'Error processing this entry',
        timestamp: new Date().toISOString(),
        duration: '1h'
      };
    }
  });
};
