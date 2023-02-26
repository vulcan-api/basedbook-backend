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
import { FriendsService } from './friends.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../auth/decorator/getUser.decorator';
import { JwtAuthDto } from '../../auth/dto/jwt-auth.dto';
import { FriendIdDto } from './dto/friendId.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('user/friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get(':userId')
  getAllFriends(@Param('userId') userId: string): Promise<object[]> {
    if ((+userId as any).isNan())
      throw new Error(
        'request should looks like /user/friends/:userId where userId is integer number',
      );
    return this.friendsService.getAllUserFriends(+userId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/invite')
  async sendInvitation(@GetUser() user: JwtAuthDto, @Body() dto: FriendIdDto) {
    await this.friendsService.sendInvitation(user.userId, dto.friendId);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('/accept')
  async acceptInvitation(
    @GetUser() user: JwtAuthDto,
    @Body() dto: FriendIdDto,
  ) {
    await this.friendsService.acceptInvitation(user.userId, dto.friendId);
  }

  @HttpCode(HttpStatus.OK)
  @Delete()
  async rejectOrRemoveFriend(
    @GetUser() user: JwtAuthDto,
    @Body('friendId') friendId: number,
  ) {
    await this.friendsService.removeFriendship(user.userId, friendId);
  }
}
