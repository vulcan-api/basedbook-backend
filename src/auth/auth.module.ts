import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

const { SECRET = 'please set other secret in .env file' } = process.env;

@Module({
  imports: [LoginModule, RegisterModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
