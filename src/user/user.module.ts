import { Module } from '@nestjs/common';
import { SkillsModule } from './skills/skills.module';
import { SettingsModule } from './settings/settings.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [SkillsModule, SettingsModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
