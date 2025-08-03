import * as React from 'react';
import { Activity, AlertTriangle, Cpu, HardDrive, Network, Gauge } from 'lucide-react';
import type { 
  SystemStatus, 
  APINetworkStats,
  NetworkTraffic as APINetworkTraffic
} from '../utils/api';

interface LiveStatsProps {
  networkTraffic: APINetworkTraffic | null;
  networkStats: APINetworkStats | null;
  systemStatus: SystemStatus | null;
  bandwidth: number;
  suspiciousActivities: string[];
  activeConnections: number;
}

export function LiveStats({ 
  networkTraffic, 
  networkStats, 
  systemStatus, 
  bandwidth, 
  suspiciousActivities, 
  activeConnections 
}: LiveStatsProps) {
  // Calculate current stats
  const currentStats = React.useMemo(() => {
    const defaultStats = {
      totalPackets: 0,
      suspiciousActivities: suspiciousActivities.length,
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      networkInterfaces: 0,
    };

    if (!networkTraffic || !networkStats || !systemStatus) {
      console.debug('LiveStats: Waiting for data...');
      return defaultStats;
    }

    // Calculate total packets
    const totalPackets = Object.values(networkTraffic.interfaces).reduce(
      (sum, iface) => sum + (iface.packets_sent || 0) + (iface.packets_recv || 0), 
      0
    );
    
    return {
      ...defaultStats,
      totalPackets,
      cpuUsage: systemStatus.cpu_usage || 0,
      memoryUsage: systemStatus.memory_usage || 0,
      diskUsage: systemStatus.disk_usage || 0,
      networkInterfaces: systemStatus.network_interfaces?.length || 0,
    };
  }, [networkTraffic, networkStats, systemStatus, suspiciousActivities]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 2xl:gap-6">
      {/* Total Packets Card */}
      <div className="rounded-lg border bg-card p-4 2xl:p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground 2xl:text-lg">Network Packets</h3>
          <Activity className="h-4 w-4 2xl:h-6 2xl:w-6 text-primary" />
        </div>
        <p className="text-2xl 2xl:text-4xl font-bold mt-2 2xl:mt-4">
          {currentStats.totalPackets.toLocaleString()}
          <span className="text-sm 2xl:text-lg font-normal text-muted-foreground ml-2">packets</span>
        </p>
      </div>

      {/* Bandwidth Usage Card */}
      <div className="rounded-lg border bg-card p-4 2xl:p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground 2xl:text-lg">Bandwidth</h3>
          <Gauge className="h-4 w-4 2xl:h-6 2xl:w-6 text-primary" />
        </div>
        <p className="text-2xl 2xl:text-4xl font-bold mt-2 2xl:mt-4">
          {bandwidth.toFixed(2)}
          <span className="text-sm 2xl:text-lg font-normal text-muted-foreground ml-2">
            Mbps ({networkStats?.bytes_sent_rate ? (networkStats.bytes_sent_rate / 1024 / 1024).toFixed(2) : '0'} MB/s ↑ / {networkStats?.bytes_received_rate ? (networkStats.bytes_received_rate / 1024 / 1024).toFixed(2) : '0'} MB/s ↓)
          </span>
        </p>
      </div>

      {/* CPU Usage Card */}
      <div className="rounded-lg border bg-card p-4 2xl:p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground 2xl:text-lg">CPU Usage</h3>
          <Cpu className="h-4 w-4 2xl:h-6 2xl:w-6 text-primary" />
        </div>
        <p className="text-2xl 2xl:text-4xl font-bold mt-2 2xl:mt-4">
          {currentStats.cpuUsage.toFixed(1)}%
          <span className="text-sm 2xl:text-lg font-normal text-muted-foreground ml-2">
            {systemStatus?.cpu_cores} cores
          </span>
        </p>
      </div>

      {/* Memory Usage Card */}
      <div className="rounded-lg border bg-card p-4 2xl:p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground 2xl:text-lg">Memory Usage</h3>
          <HardDrive className="h-4 w-4 2xl:h-6 2xl:w-6 text-primary" />
        </div>
        <p className="text-2xl 2xl:text-4xl font-bold mt-2 2xl:mt-4">
          {currentStats.memoryUsage.toFixed(1)}%
          <span className="text-sm 2xl:text-lg font-normal text-muted-foreground ml-2">
            {systemStatus ? Math.round(systemStatus.memory_used / (1024 * 1024 * 1024)) : 0}GB / {systemStatus ? Math.round(systemStatus.memory_total / (1024 * 1024 * 1024)) : 0}GB
          </span>
        </p>
      </div>

      {/* Disk Usage Card */}
      <div className="rounded-lg border bg-card p-4 2xl:p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground 2xl:text-lg">Disk Usage</h3>
          <HardDrive className="h-4 w-4 2xl:h-6 2xl:w-6 text-primary" />
        </div>
        <p className="text-2xl 2xl:text-4xl font-bold mt-2 2xl:mt-4">
          {currentStats.diskUsage.toFixed(1)}%
          <span className="text-sm 2xl:text-lg font-normal text-muted-foreground ml-2">
            {systemStatus ? Math.round(systemStatus.disk_used / (1024 * 1024 * 1024)) : 0}GB / {systemStatus ? Math.round(systemStatus.disk_total / (1024 * 1024 * 1024)) : 0}GB
          </span>
        </p>
      </div>

      {/* Network Interfaces Card */}
      <div className="rounded-lg border bg-card p-4 2xl:p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground 2xl:text-lg">Network Interfaces</h3>
          <Network className="h-4 w-4 2xl:h-6 2xl:w-6 text-primary" />
        </div>
        <p className="text-2xl 2xl:text-4xl font-bold mt-2 2xl:mt-4">
          {currentStats.networkInterfaces}
          <span className="text-sm 2xl:text-lg font-normal text-muted-foreground ml-2">
            {activeConnections} active connections
          </span>
        </p>
      </div>

      {/* Active Connections Card */}
      <div className="rounded-lg border bg-card p-4 2xl:p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground 2xl:text-lg">Active Connections</h3>
          <Activity className="h-4 w-4 2xl:h-6 2xl:w-6 text-primary" />
        </div>
        <p className="text-2xl 2xl:text-4xl font-bold mt-2 2xl:mt-4">
          {activeConnections}
          <span className="text-sm 2xl:text-lg font-normal text-muted-foreground ml-2">
            active
          </span>
        </p>
      </div>

      {/* Suspicious Activities Card */}
      <div className="rounded-lg border bg-card p-4 2xl:p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground 2xl:text-lg">Suspicious Activities</h3>
          <AlertTriangle className={`h-4 w-4 ${
            currentStats.suspiciousActivities > 0 ? 'text-red-500' : 'text-primary'
          }`} />
        </div>
        <p className="text-2xl 2xl:text-4xl font-bold mt-2 2xl:mt-4">
          {currentStats.suspiciousActivities}
          <span className="text-sm 2xl:text-lg font-normal text-muted-foreground ml-2">detected</span>
        </p>
      </div>
    </div>
  );
} 