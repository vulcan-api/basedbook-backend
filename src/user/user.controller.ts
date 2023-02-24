import { Controller, Param, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:userId')
  async getPublicInformation(@Param('userId') userId: string) {
    return this.userService.getPublicInformation(parseInt(userId));
  }
}
