import { Controller, Param, Get, Query, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { SpottedService } from '../spotted/spotted.service';
import { ProjectService } from '../project/project.service';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly spottedService: SpottedService,
    private readonly projectService: ProjectService,
  ) {}

  @Get()
  async findUsersByName(@Query('name') name: string): Promise<object[]> {
    if (name) return this.userService.findUsersByUserName(name);
    return [];
  }

  @Get('/:userId')
  async getPublicInformation(@Param('userId') userId: string) {
    return this.userService.getPublicInformation(parseInt(userId));
  }

  @Get('/:userId/spottedPosts')
  async getSpottedPosts(@Param('userId', ParseIntPipe) userId: number) {
    return this.spottedService.getUsersPosts(0, 999, userId);
  }

  @Get('/:userId/projects')
  async getProjects(@Param('userId') userId: string) {
    return this.projectService.getUserProjects(parseInt(userId));
  }
}
