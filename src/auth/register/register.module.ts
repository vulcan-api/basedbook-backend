import { forwardRef, Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { AuthModule } from '../auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [RegisterController],
})
export class RegisterModule {}
