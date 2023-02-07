import { Module } from '@nestjs/common';
import { SpottedController } from './spotted.controller';
import { SpottedService } from './spotted.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SpottedController],
  providers: [SpottedService],
})
export class SpottedModule {}
