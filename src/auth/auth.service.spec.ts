import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { DbModule } from '../db/db.module';

const { SECRET: secret = 'secret' } = process.env;
describe('SpottedController', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        DbModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret,
          signOptions: { expiresIn: 3600 * 24 * 30 },
        }),
        ConfigModule.forRoot({ isGlobal: true }),
        MailerModule.forRootAsync({
          useFactory: () => ({
            transport: {
              host: process.env.SMTP_HOST,
              secure: false,
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              },
            },
            defaults: { from: 'Muj Elektryk' },
          }),
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should return a jwt token', async () => {
    const token: string = await authService.generateAuthJwt({
      userId: 1,
      roles: ['USER'],
      isBanned: false,
    });
    expect(token).toBeDefined();
  });
});
