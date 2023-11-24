import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: true,
  namespace: 'board',
  transports: ['websocket'],
})
export class BoardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private wss: Server;

  handleDisconnect(client: Socket) {
    console.log(`client disconnected : ${client.id}`);
  }

  handleConnection(client: Socket) {
    console.log(
      `client connected to ${process.pid} successfully : `,
      client.id,
    );
  }

  @SubscribeMessage('UPDATE_DATA')
  async handleUpdateData(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    body,
  ): Promise<void> {
    client.broadcast.emit('UPDATE_DATA', body);
  }
}
