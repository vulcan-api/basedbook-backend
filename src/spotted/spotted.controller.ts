import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
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
import { OptionalJwtGuard } from '../auth/guards/OptionalJwt.guard';

@Controller('spotted')
export class SpottedController {
  constructor(private readonly spottedService: SpottedService) {}

  @UseGuards(OptionalJwtGuard)
  @Get('/post')
  getAllPostsUnauthorized(
    @Query('postSkip') postSkip = '0',
    @Query('postTake') postTake = '10',
    @Query('commentSkip') skipComment = '0',
    @Query('commentTake') takeComment = '10',
    @Query('maxRepliesNesting') maxRepliesNesting = '2',
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    console.table({ user });
    return this.spottedService.getPostList(
      user ? user.userId : undefined,
      +postSkip,
      +postTake,
      +skipComment,
      +takeComment,
      +maxRepliesNesting,
    );
  }
  @Get('/count')
  getPostsCount(): Promise<number> {
    return this.spottedService.getPostsCount();
  }
  @UseGuards(OptionalJwtGuard)
  @Get('/post/:id')
  getSpecificPost(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: JwtAuthDto,
  ): object {
    return this.spottedService.getPostById(id, user ? user.userId : undefined);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/post')
  async addNewSpottedPost(
    @Body() body: InsertPostDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    await this.spottedService.insertNewPost(body, user.userId);
    return { ok: true, statusCode: 200 };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/post')
  async changePostData(
    @Body() body: UpdatePostDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    await this.spottedService.changePostById(body, user.userId, user.roles);
    return { ok: true, statusCode: 200 };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/post/:id')
  async deletePost(
    @Param('id') id: number,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    if (!id) throw new Error('No post id provided');
    await this.spottedService.deletePostById(id, user.userId, user.roles);
    return { ok: true, statusCode: 200 };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/post/:id/like')
  async giveALike(
    @Param('id') id: number,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    await this.spottedService.giveALike(id, user.userId);
    return { ok: true, statusCode: 200 };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/post/:id/unlike')
  async removeLike(
    @Param('id') postId: number,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    await this.spottedService.removeLike(postId, user.userId);
    return { ok: true, statusCode: 200 };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/report')
  @HttpCode(HttpStatus.CREATED)
  async reportPost(
    @Body() dto: ReportDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    return this.spottedService.report(dto.postId, user.userId, dto.reason);
  }
}
