import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayDisconnect, OnGatewayConnection, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { OnModuleInit } from "@nestjs/common";
import { ChatService } from 'src/chat/chat.service';
import { Logger } from '@nestjs/common'


@WebSocketGateway({ cors: { origin: 'http://localhost:3000', credentials: true } })
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  private logger = new Logger('ChatGateway')



  
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, roomId: { id: string }) {
    client.join(roomId.id);
    this.logger.log(`User ${client.id} joined room: ${roomId.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, message: any) {
    const { senderId, groupId, messageText } = message;
    const newMessage = await this.chatService.createMessage(senderId, parseInt(groupId, 10), messageText);
    try {
      this.server.to(groupId).emit('sendMessage', newMessage);
    } catch (error) {
      console.error(`Error when sending message to room ${groupId}:`, error);
    }
  }

  async handleConnection(socket: Socket): Promise<void> {
    this.logger.log(`Socket connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket): Promise<void >{
    // Handle disconnection and remove the socket from chat rooms, if needed.
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }
}