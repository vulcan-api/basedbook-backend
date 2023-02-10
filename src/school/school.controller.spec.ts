import { Test, TestingModule } from '@nestjs/testing';
import { SchoolController } from './school.controller';
import { DbModule } from '../db/db.module';
import { ConfigModule } from '@nestjs/config';

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
    }).compile();

    controller = module.get<SchoolController>(SchoolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
