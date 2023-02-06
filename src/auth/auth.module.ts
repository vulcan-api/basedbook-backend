import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { VerifyModule } from './verify/verify.module';

@Module({
  controllers: [AuthController],
  imports: [LoginModule, RegisterModule, VerifyModule],
})
export class AuthModule {}
