import React, { useEffect, useState, useMemo } from 'react';
import { Network } from 'lucide-react';
import type { NetworkTraffic as APINetworkTraffic } from '../utils/api';

interface NetworkTableProps {
  traffic: APINetworkTraffic | null;
}

// Interface for network interface data
interface NetworkInterfaceStats {
  name: string;
  bytes_sent: number;
  bytes_recv: number;
  packets_sent: number;
  packets_recv: number;
  errin?: number;
  errout?: number;
  dropin?: number;
  dropout?: number;
  sent_rate?: number;
  recv_rate?: number;
  last_updated?: string;
}

export function NetworkTable({ traffic }: NetworkTableProps) {
  // Process network interfaces data
  const interfaces = useMemo(() => {
    if (!traffic?.interfaces) return [];
    
    return Object.entries(traffic.interfaces).map(([name, stats]) => ({
      name,
      ...stats,
      // Calculate bandwidth in KB/s (if rates are available)
      sent_rate: (traffic as any)?.current_rate?.bytes_sent || 0,
      recv_rate: (traffic as any)?.current_rate?.bytes_recv || 0,
      last_updated: traffic.timestamp || new Date().toISOString()
    }));
  }, [traffic]);
  
  if (!interfaces.length) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Network className="h-12 w-12 text-muted-foreground/50" />
          <div>
            <h3 className="text-lg font-medium">No Network Interfaces Found</h3>
            <p className="text-sm text-muted-foreground">
              No active network interfaces detected. Make sure your network is connected.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to format bytes
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Helper function to format rate
  const formatRate = (bytesPerSec: number) => {
    if (bytesPerSec === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytesPerSec) / Math.log(k));
    return parseFloat((bytesPerSec / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="rounded-lg border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Interface</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Sent</th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Received</th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Rate (Up/Down)</th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Packets</th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Errors</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {interfaces.map((iface) => (
              <tr key={iface.name} className="border-b transition-colors hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>{iface.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  {formatBytes(iface.bytes_sent || 0)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  {formatBytes(iface.bytes_recv || 0)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  <div className="flex flex-col">
                    <span className="text-green-600">↑ {formatRate(iface.sent_rate || 0)}</span>
                    <span className="text-blue-600">↓ {formatRate(iface.recv_rate || 0)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  <div className="flex flex-col">
                    <span>↑ {iface.packets_sent?.toLocaleString() || '0'}</span>
                    <span>↓ {iface.packets_recv?.toLocaleString() || '0'}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  <div className="flex flex-col">
                    <span className="text-red-600">✗ {iface.errout || 0}</span>
                    <span className="text-red-600">✗ {iface.errin || 0}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {traffic?.timestamp && (
        <div className="bg-muted/30 p-2 text-right text-xs text-muted-foreground">
          Last updated: {new Date(traffic.timestamp).toLocaleString()}
        </div>
      )}
    </div>
  );
}