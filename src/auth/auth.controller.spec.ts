import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';

const { SECRET: secret = 'secret' } = process.env;
describe('SpottedController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret,
          signOptions: { expiresIn: 3600 * 24 * 30 },
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });
});
