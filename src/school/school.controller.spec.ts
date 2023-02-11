import { Test, TestingModule } from '@nestjs/testing';
import { SchoolController } from './school.controller';
import { DbModule } from '../db/db.module';
import { ConfigModule } from '@nestjs/config';
import { SchoolService } from './school.service';

describe('SchoolController', () => {
  let controller: SchoolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DbModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      controllers: [SchoolController],
      providers: [SchoolService],
    }).compile();

    controller = module.get<SchoolController>(SchoolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
