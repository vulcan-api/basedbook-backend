import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { AuthModule } from '../auth/auth.module';
import { VulcanSigner } from './vulcan-signer.service';

@Module({
  controllers: [SchoolController],
  providers: [SchoolService, VulcanSigner],
  imports: [AuthModule],
})
export class SchoolModule {}
