import { Test, TestingModule } from '@nestjs/testing';
import { OlympicsService } from './olympics.service';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '../db/db.module';
import { OlympicsController } from './olympics.controller';

describe('OlympicsService', () => {
  let service: OlympicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
        DbModule,
      ],
      controllers: [OlympicsController],
      providers: [OlympicsService],
    }).compile();

    service = module.get<OlympicsService>(OlympicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
