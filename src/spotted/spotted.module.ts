import { Module } from '@nestjs/common';
import { SpottedController } from './spotted.controller';
import { SpottedService } from './spotted.service';

@Module({
  controllers: [SpottedController],
  providers: [SpottedService],
})
export class SpottedModule {}
