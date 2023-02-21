import { Module } from '@nestjs/common';
import { SkillsModule } from './skills/skills.module';

@Module({
  imports: [SkillsModule],
})
export class UserModule {}
