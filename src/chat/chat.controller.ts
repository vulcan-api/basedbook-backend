import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { JwtAuthDto } from '../auth/dto/jwt-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/sendMessage.dto';
import { EditMessageDto } from './dto/editMessage.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}
  @Get('conversation/:receiverId')
  async getConversation(
    @Param('receiverId') receiverId: number,
    @GetUser() user: JwtAuthDto,
  ) {
    return await this.chatService.getConversation(user.userId, receiverId);
  }
  @Post('send')
  async sendMessage(@Body() dto: SendMessageDto, @GetUser() user: JwtAuthDto) {
    await this.chatService.sendMessage(
      dto.content,
      user.userId,
      dto.receiverId,
    );
    //TODO
    //WebSockets
  }
  @Put('edit/:messageId')
  async editMessage(
    @GetUser() user: JwtAuthDto,
    @Body() dto: EditMessageDto,
    @Param('messageId') messageId: string,
  ) {
    return await this.chatService.editMessage(
      user.userId,
      +messageId,
      dto.content,
    );
  }
  @Delete('delete/:messageId')
  async deleteMessage(
    @GetUser() user: JwtAuthDto,
    @Param('messageId') messageId: string,
  ) {
    return await this.chatService.deleteMessage(user.userId, +messageId);
  }
}
