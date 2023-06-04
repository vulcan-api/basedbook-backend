import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { VerifyModule } from './verify/verify.module';
import { JwtModule } from '@nestjs/jwt';
import { ResetModule } from './reset/reset.module';
import { RemoveController } from './remove/remove.controller';
import { RemoveService } from './remove/remove.service';
import { TotpController } from './totp/totp.controller';
import { TotpService } from './totp/totp.service';

const { SECRET: secret = 'secret' } = process.env;

@Module({
  imports: [
    forwardRef(() => LoginModule),
    forwardRef(() => RegisterModule),
    forwardRef(() => VerifyModule),
    forwardRef(() => ResetModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret,
      signOptions: { expiresIn: 3600 * 24 * 30 },
    }),
  ],
  controllers: [AuthController, RemoveController, TotpController],
  providers: [AuthService, JwtStrategy, RemoveService, TotpService],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
