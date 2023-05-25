import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
