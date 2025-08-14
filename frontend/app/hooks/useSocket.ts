import { useEffect, useState } from 'react';
import io from 'socket.io-client';


export function useSocket() {
  const [activeTabs, setActiveTabs] = useState(0);

  useEffect(() => {

    const socket = io(`${window.location.origin}/socket.io` , { transports: ['websocket'] });

    socket.on('connect', () => console.log('Connected to WS server:', socket.id));
    socket.on('tabsCount', (count: number) => setActiveTabs(count));
    socket.on('disconnect', () => console.log('Disconnected from WS server'));
    socket.on('connect_error', (err: any) => console.error('Connection error:', err));

    return () => {
      socket.disconnect();
    };
  }, []);

  return activeTabs;
}