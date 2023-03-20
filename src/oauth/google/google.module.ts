import { Module } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { GoogleStrategy } from './google.strategy';
import { AuthModule } from '../../auth/auth.module';
import { FacebookModule } from '../facebook/facebook.module';

@Module({
  controllers: [GoogleController],
  providers: [GoogleService, GoogleStrategy],
  imports: [AuthModule, FacebookModule],
})
export class GoogleModule {}
