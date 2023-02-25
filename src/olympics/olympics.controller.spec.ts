import { Test, TestingModule } from '@nestjs/testing';
import { OlympicsController } from './olympics.controller';
import { OlympicsService } from './olympics.service';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '../db/db.module';

describe('OlympicsController', () => {
  let controller: OlympicsController;

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

    controller = module.get<OlympicsController>(OlympicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
