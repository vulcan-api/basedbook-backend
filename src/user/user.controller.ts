import { Controller, Param, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { SpottedService } from '../spotted/spotted.service';

@Controller('/user')
export class UserController {
  constructor(
    private userService: UserService,
    private spottedService: SpottedService,
  ) {}

  @Get('/:userId')
  async getPublicInformation(@Param('userId') userId: string) {
    return this.userService.getPublicInformation(parseInt(userId));
  }

  @Get('/:userId/spottedPosts')
  async getSpottedPosts(@Param('userId') userId: string) {
    return this.spottedService.getPostList(0, 999, parseInt(userId));
  }
}
