import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedClients = new Set<string>();

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.connectedClients.add(client.id);
    this.emitTabsCount();
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
    this.emitTabsCount();
  }

  private emitTabsCount() {
    const count = this.connectedClients.size;
    this.server.emit('tabsCount', count);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): void {
    console.log('Message from client:', data);
    this.server.emit('message', `Server got: ${data}`);
  }
}