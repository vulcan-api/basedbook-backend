import { Module } from '@nestjs/common';
import { FacebookController } from './facebook.controller';
import { FacebookService } from './facebook.service';
import { FacebookStrategy } from './facebook.strategy';
import { AuthModule } from '../../auth/auth.module';

@Module({
  controllers: [FacebookController],
  providers: [FacebookService, FacebookStrategy],
  imports: [AuthModule],
  exports: [FacebookService],
})
export class FacebookModule {}
