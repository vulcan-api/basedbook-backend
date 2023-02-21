import { Module } from '@nestjs/common';
import { SkillsModule } from './skills/skills.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [SkillsModule, SettingsModule],
})
export class UserModule {}
