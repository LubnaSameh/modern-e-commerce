'use client';

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useKeepAlive } from '@/lib/keep-alive';

// Define different server connection states
export enum ServerStatus {
    UNKNOWN = 'unknown',
    ONLINE = 'online',
    OFFLINE = 'offline',
    RECONNECTING = 'reconnecting'
}

// Define the server status context type
interface ServerStatusContextType {
    status: ServerStatus;
    lastPingTime: number | null;
    isOnline: boolean;
    checkConnection: () => Promise<boolean>;
}

// Create server status context
const ServerStatusContext = createContext<ServerStatusContextType>({
    status: ServerStatus.UNKNOWN,
    lastPingTime: null,
    isOnline: false,
    checkConnection: async () => false
});

// Helper function to check server status
async function pingServer(url: string): Promise<boolean> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(`${url}?t=${Date.now()}`, {
            method: 'HEAD',
            signal: controller.signal,
            cache: 'no-store'
        });

        clearTimeout(timeoutId);
        return response.ok;
    } catch (error) {
        console.error('Server ping failed:', error);
        return false;
    }
}

// Server status provider
export function ServerStatusProvider({ children }: { children: ReactNode }) {
    const [status, setStatus] = useState<ServerStatus>(ServerStatus.UNKNOWN);
    const [lastPingTime, setLastPingTime] = useState<number | null>(null);

    // Use keep-alive mechanism
    useKeepAlive();

    // Function to check server connection status
    const checkConnection = async (): Promise<boolean> => {
        try {
            setStatus(ServerStatus.RECONNECTING);

            // Check products API connection
            const isAPIAlive = await pingServer('/api/products?limit=1');

            if (isAPIAlive) {
                setStatus(ServerStatus.ONLINE);
                setLastPingTime(Date.now());
                return true;
            } else {
                setStatus(ServerStatus.OFFLINE);
                return false;
            }
        } catch (error) {
            console.error('Connection check failed:', error);
            setStatus(ServerStatus.OFFLINE);
            return false;
        }
    };

    // Check connection when page loads
    useEffect(() => {
        // Check connection immediately when page loads
        checkConnection();

        // Then recheck every minute instead of every 30 seconds
        const interval = setInterval(checkConnection, 60000);

        return () => clearInterval(interval);
    }, []);

    // Improve performance by memoizing the value
    const value = useMemo(() => ({
        status,
        lastPingTime,
        isOnline: status === ServerStatus.ONLINE,
        checkConnection
    }), [status, lastPingTime]);

    return (
        <ServerStatusContext.Provider value={value}>
            {children}
        </ServerStatusContext.Provider>
    );
}

// Hook to access server status from any component
export function useServerStatus() {
    return useContext(ServerStatusContext);
} 