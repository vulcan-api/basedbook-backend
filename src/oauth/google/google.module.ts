import { Module } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { GoogleStrategy } from './google.strategy';
import { AuthModule } from '../../auth/auth.module';

@Module({
  controllers: [GoogleController],
  providers: [GoogleService, GoogleStrategy],
  imports: [AuthModule],
})
export class GoogleModule {}
