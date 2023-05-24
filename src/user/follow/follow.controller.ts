import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../auth/decorator/getUser.decorator';
import { JwtAuthDto } from '../../auth/dto/jwt-auth.dto';
import { FollowDto } from './dto/follow.dto';

@Controller('user/follows')
export class FollowController {
  constructor(private readonly friendsService: FollowService) {}

  @Get('/followers/:userId')
  getAllFollowers(@Param('userId') userId: string): Promise<object[]> {
    if (isNaN(+userId))
      throw new Error(
        'request should looks like /user/follows/followers/:userId where userId is integer number',
      );
    return this.friendsService.getAllFollowers(+userId);
  }

  @Get('/following/:userId')
  getAllFollowing(@Param('userId') userId: string): Promise<object[]> {
    if (isNaN(+userId))
      throw new Error(
        'request should looks like /user/follows/following/:userId where userId is integer number',
      );
    return this.friendsService.getAllFollowing(+userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async follow(@GetUser() user: JwtAuthDto, @Body() dto: FollowDto) {
    await this.friendsService.followUser(user.userId, dto.userId);
    return { statusCode: HttpStatus.CREATED, message: 'followed' };
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Delete()
  async unfollow(@GetUser() user: JwtAuthDto, @Body() dto: FollowDto) {
    await this.friendsService.unfollowUser(user.userId, dto.userId);
    return { statusCode: HttpStatus.OK, message: 'unfollowed' };
  }
}
