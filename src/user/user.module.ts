import { Module } from '@nestjs/common';
import { SkillsModule } from './skills/skills.module';
import { SettingsModule } from './settings/settings.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SpottedService } from '../spotted/spotted.service';
import { FollowModule } from './follow/follow.module';
import { ProjectService } from '../project/project.service';

@Module({
  imports: [SkillsModule, SettingsModule, FollowModule],
  controllers: [UserController],
  providers: [UserService, SpottedService, ProjectService],
})
export class UserModule {}
