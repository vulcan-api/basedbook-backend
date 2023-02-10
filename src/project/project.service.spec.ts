import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { DbService } from '../db/db.service';
import { DbModule } from '../db/db.module';
import { ProjectController } from './project.controller';
import { ConfigModule } from '@nestjs/config';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DbModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      controllers: [ProjectController],
      providers: [ProjectService],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
