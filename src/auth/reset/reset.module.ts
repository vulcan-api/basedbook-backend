import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth.module';
import { ResetController } from './reset.controller';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [ResetController],
})
export class ResetModule {}
