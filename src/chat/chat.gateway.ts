import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { SendDto } from './dto/send.dto';
import { ChatService } from './chat.service';
import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { JwtAuthDto } from '../auth/dto/jwt-auth.dto';
import { Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/socket',
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard('jwt'))
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: SendDto,
    @GetUser() sender: JwtAuthDto,
  ): Promise<SendDto> {
    await this.chatService.sendMessage(
      data.content,
      sender.userId,
      data.conversation,
    );
    socket.to(`${data.conversation}`).emit('receiveMessage');
    socket.emit('receiveMessage');
    return data;
  }

  @UseGuards(AuthGuard('jwt'))
  @SubscribeMessage('join')
  async handleJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody('conversationId', ParseIntPipe) conversationId: number,
  ) {
    socket.join(`${conversationId}`);
  }
}
