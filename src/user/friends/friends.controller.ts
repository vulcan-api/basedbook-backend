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

@UseGuards(AuthGuard('jwt'))
@Controller('user/friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get(':userId')
  getAllFriends(@Param('userId') userId: string): Promise<object[]> {
    return this.friendsService.getAllUserFriends(+userId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/invite')
  async sendInvitation(
    @GetUser() user: JwtAuthDto,
    @Body('friendId') friendId: number,
  ) {
    await this.friendsService.sendInvitation(user.userId, friendId);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('/accept')
  async acceptInvitation(
    @GetUser() user: JwtAuthDto,
    @Body('friendId') friendId: number,
  ) {
    await this.friendsService.acceptInvitation(user.userId, friendId);
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
