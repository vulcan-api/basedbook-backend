import { Module } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { VerifyController } from './verify.controller';

@Module({
  providers: [AuthService],
  controllers: [VerifyController],
})
export class VerifyModule {}
