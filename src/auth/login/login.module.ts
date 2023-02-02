import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { AuthService } from '../auth.service';

@Module({
  providers: [AuthService],
  controllers: [LoginController],
})
export class LoginModule {}
