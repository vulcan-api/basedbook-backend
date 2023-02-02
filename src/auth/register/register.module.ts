import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { AuthService } from '../auth.service';

@Module({
  providers: [AuthService],
  controllers: [RegisterController],
})
export class RegisterModule {}
