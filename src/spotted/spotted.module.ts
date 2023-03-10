import { Module } from '@nestjs/common';
import { SpottedController } from './spotted.controller';
import { SpottedService } from './spotted.service';
import { AuthModule } from '../auth/auth.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [AuthModule, CommentModule],
  controllers: [SpottedController],
  providers: [SpottedService],
})
export class SpottedModule {}
