import { Controller, Get } from '@nestjs/common';
import { OlympicsService } from './olympics.service';

@Controller('olympics')
export class OlympicsController {
  constructor(private olympicsService: OlympicsService) {}

  @Get()
  async getAllOlympics(): Promise<object> {
    return this.olympicsService.getAllOlympics();
  }
}
