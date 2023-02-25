import { Controller, Param, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { SpottedService } from '../spotted/spotted.service';

@Controller('/user')
export class UserController {
  constructor(
    private userService: UserService,
    private spottedService: SpottedService,
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
  async getSpottedPosts(@Param('userId') userId: string) {
    return this.spottedService.getUsersPosts(0, 999, parseInt(userId));
  }
}
