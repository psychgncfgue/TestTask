import { useEffect, useState } from "react";
import  io  from "socket.io-client";

export function useSocket() {
  const [activeTabs, setActiveTabs] = useState(0);

  useEffect(() => {
    const socket= io('http://localhost:5000', {
      transports: ["websocket"],
    });

    socket.on("connect", () => console.log("✅ Connected to Next.js WS", socket.id));
    socket.on("tabsCount", (count: number) => setActiveTabs(count));
    socket.on("disconnect", () => console.log("❌ Disconnected"));
    socket.on("connect_error", (err: any) => console.error("WS Error:", err));

    return () => {
      socket.disconnect();
    };
  }, []);

  return activeTabs;
}