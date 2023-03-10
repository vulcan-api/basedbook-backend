import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SpottedService } from './spotted.service';
import { InsertPostDto } from './dto/insertPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { JwtAuthDto } from '../auth/dto/jwt-auth.dto';
import { ReportDto } from './dto/report.dto';
import { CommentDto } from './comment/dto/comment.dto';
import { take } from 'rxjs';

@UseGuards(AuthGuard('jwt'))
@Controller('spotted')
export class SpottedController {
  constructor(private readonly spottedService: SpottedService) {}

  @Get('/post')
  getAllPosts(
    @Query('postSkip') postSkip = '0',
    @Query('postTake') postTake = '10',
    @Query('commentSkip') skipComment = '0',
    @Query('commentTake') takeComment = '10',
    @Query('maxRepliesNesting') maxRepliesNesting = '2',
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    return this.spottedService.getPostList(
      user.userId,
      +postSkip,
      +postTake,
      +skipComment,
      +takeComment,
      +maxRepliesNesting,
    );
  }

  @Get('/post/:id')
  getSpecificPost(
    @Param('id') id: string,
    @GetUser() user: JwtAuthDto,
  ): object {
    return this.spottedService.getPostById(parseInt(id), user.userId);
  }

  @Put('/post')
  async addNewSpottedPost(
    @Body() body: InsertPostDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    await this.spottedService.insertNewPost(body, user.userId);
    return { ok: true, statusCode: 200 };
  }

  @Patch('/post')
  async changePostData(
    @Body() body: UpdatePostDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    await this.spottedService.changePostById(body, user.userId);
    return { ok: true, statusCode: 200 };
  }

  @Delete('/post')
  async deletePost(
    @Body('id') id: number,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    await this.spottedService.deletePostById(id, user.userId);
    return { ok: true, statusCode: 200 };
  }

  @Post('/post/:id/like')
  async giveALike(
    @Param('id') id: number,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    await this.spottedService.giveALike(id, user.userId);
    return { ok: true, statusCode: 200 };
  }

  @Post('/post/:id/unlike')
  async removeLike(
    @Param('id') postId: number,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    await this.spottedService.removeLike(postId, user.userId);
    return { ok: true, statusCode: 200 };
  }

  @Post('/report')
  @HttpCode(HttpStatus.CREATED)
  async reportPost(
    @Body() dto: ReportDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    return this.spottedService.report(dto.postId, user.userId, dto.reason);
  }
}
