import { Test, TestingModule } from '@nestjs/testing';
import { SchoolService } from './school.service';
import { DbModule } from '../db/db.module';
import { ConfigModule } from '@nestjs/config';

describe('SchoolService', () => {
  let service: SchoolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DbModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [SchoolService],
    }).compile();

    service = module.get<SchoolService>(SchoolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
