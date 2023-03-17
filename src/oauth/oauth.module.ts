import { Module } from '@nestjs/common';
import { FacebookModule } from './facebook/facebook.module';
@Module({
  imports: [FacebookModule],
})
export class OauthModule {}
