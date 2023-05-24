import {
  Controller,
  Param,
  Get,
  Query,
  ParseIntPipe,
  UseGuards,
  Delete,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SpottedService } from '../spotted/spotted.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { JwtAuthDto } from '../auth/dto/jwt-auth.dto';
@UseGuards(AuthGuard('jwt'))
@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly spottedService: SpottedService,
  ) {}

  @Get()
  async findUsersByName(@Query('name') name: string): Promise<object[]> {
    if (name) return this.userService.findUsersByUserName(name);
    return [];
  }

  @Get('/:userId')
  async getPublicInformation(
    @Param('userId', ParseIntPipe) userId: number,
    @GetUser() user: JwtAuthDto,
  ) {
    return this.userService.getPublicInformation(
      userId,
      user ? user.userId : undefined,
    );
  }

  @Get('/:userId/spottedPosts')
  async getSpottedPosts(@Param('userId', ParseIntPipe) userId: number) {
    return this.spottedService.getUsersPosts(0, 999, userId);
  }

  @Delete()
  async deleteAccount(@GetUser() user: JwtAuthDto) {
    await this.userService.deleteAccount(user.userId);
    return { message: 'Account deleted', statusCode: 200 };
  }

  @Post('/:userId/ban')
  async banUser(@GetUser() user: JwtAuthDto) {
    await this.userService.banUser(user.userId);
    return { message: 'User banned', statusCode: 200 };
  }
}
