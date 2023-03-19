import { Module } from '@nestjs/common';
import { FacebookModule } from './facebook/facebook.module';
import { GoogleModule } from './google/google.module';
@Module({
  imports: [FacebookModule, GoogleModule],
})
export class OauthModule {}
