import { NextResponse } from "next/server";
import { Server } from "socket.io";
import ClientIO from "socket.io-client";

let ioServer: Server | null = null;
let backendSocket: ReturnType<typeof ClientIO> | null = null;

const BACKEND_URL = process.env.BACKEND_URL!;

export async function GET() {
  return NextResponse.json({ message: "Socket endpoint" });
}

export default function setupSocket(req: any, res: any) {
  if (!ioServer) {
    const server = res.socket.server;

    ioServer = new Server(server, {
      path: "/api/socket",
      cors: { origin: "*" },
    });
    server.io = ioServer;

    backendSocket = ClientIO(BACKEND_URL, { transports: ["websocket"] });

    backendSocket.on("tabsCount", (count: number) => {
      ioServer!.emit("tabsCount", count);
    });

    ioServer.on("connection", (socket) => {
      console.log("✅ Frontend connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("❌ Frontend disconnected:", socket.id);
      });
    });
  }
}