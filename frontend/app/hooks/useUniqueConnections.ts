import { useEffect, useState } from 'react';

export function useUniqueConnections() {
  const [activeTabs, setActiveTabs] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch('/api/ws-data'); 
      const data = await res.json();
      setActiveTabs(data.tabsCount);
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  return activeTabs;
}