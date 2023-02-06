import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [AuthService, JwtService],
  controllers: [LoginController],
})
export class LoginModule {}
