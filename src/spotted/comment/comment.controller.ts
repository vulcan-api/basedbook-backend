import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentDto } from './dto/comment.dto';
import { GetUser } from '../../auth/decorator/getUser.decorator';
import { JwtAuthDto } from '../../auth/dto/jwt-auth.dto';
import { CommentService } from './comment.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('spotted/post')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/comment/:postId')
  async addComment(
    @Param('postId') postId: string,
    @Body() dto: CommentDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    await this.commentService.addComment(
      +postId,
      user.userId,
      dto.text,
      dto.commentId,
    );
    return { ok: true, statusCode: 200 };
  }

  @Delete('/comment/:commentId')
  async deleteComment(
    @Param('commentId') commentId: string,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    await this.commentService.deleteComment(+commentId, user.userId);
    return { ok: true, statusCode: 200 };
  }
}
