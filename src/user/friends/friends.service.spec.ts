import { Test, TestingModule } from '@nestjs/testing';
import { FriendsService } from './friends.service';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '../../db/db.module';

describe('FriendsService', () => {
  let service: FriendsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
        DbModule,
      ],
      providers: [FriendsService],
    }).compile();

    service = module.get<FriendsService>(FriendsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
