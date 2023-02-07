import { forwardRef, Module } from '@nestjs/common';
import { VerifyController } from './verify.controller';
import { AuthModule } from '../auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [VerifyController],
})
export class VerifyModule {}
