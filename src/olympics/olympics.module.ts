import { Module } from '@nestjs/common';
import { OlympicsController } from './olympics.controller';
import { OlympicsService } from './olympics.service';

@Module({
  controllers: [OlympicsController],
  providers: [OlympicsService],
})
export class OlympicsModule {}
