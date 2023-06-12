import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { DbModule } from '../db/db.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [DbModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
