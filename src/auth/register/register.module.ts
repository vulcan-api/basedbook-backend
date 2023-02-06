import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [AuthService, JwtService],
  controllers: [RegisterController],
})
export class RegisterModule {}
