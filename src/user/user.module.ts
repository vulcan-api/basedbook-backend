import { Module } from '@nestjs/common';
import { SkillsModule } from './skills/skills.module';
import { SettingsModule } from './settings/settings.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SpottedService } from '../spotted/spotted.service';
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [SkillsModule, SettingsModule, FollowModule],
  controllers: [UserController],
  providers: [UserService, SpottedService],
})
export class UserModule {}
