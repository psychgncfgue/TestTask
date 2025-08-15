import { NextResponse } from 'next/server';
import ClientIO from 'socket.io-client';

const backUrl = process.env.BACKEND_URL!;
let backendSocket: ReturnType<typeof ClientIO> | null = null;

function getBackendSocket() {
  if (!backendSocket) {
    backendSocket = ClientIO(backUrl, { transports: ['websocket'] });
    console.log('🔌 Connecting to backend WS...');
  }
  return backendSocket;
}

export async function GET() {
  const socket = getBackendSocket();

  return new Promise<NextResponse>((resolve) => {
    if ((socket as any).lastTabsCount !== undefined) {
      return resolve(NextResponse.json({ tabsCount: (socket as any).lastTabsCount }));
    }

    const handler = (count: number) => {
      socket.off('tabsCount', handler); 
      (socket as any).lastTabsCount = count;
      resolve(NextResponse.json({ tabsCount: count }));
    };

    socket.on('tabsCount', handler);
  });
}