import {
  Body,
  Controller,
  Delete,
  Get,
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

@Controller('spotted')
export class SpottedController {
  constructor(private readonly spottedService: SpottedService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/post')
  getAllPosts(
    @Query('skip') skip = '0',
    @Query('take') take = '10',
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    return this.spottedService.getPostList(
      parseInt(skip),
      parseInt(take),
      user.userId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/post/:id')
  getSpecificPost(
    @Param('id') id: string,
    @GetUser() user: JwtAuthDto,
  ): object {
    return this.spottedService.getPostById(parseInt(id), user.userId);
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
    await this.spottedService.changePostById(body, user.userId);
    return { ok: true, statusCode: 200 };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/post')
  async deletePost(
    @Body('id') id: number,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    await this.spottedService.deletePostById(id, user.userId);
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
    @Param('id') id: number,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    await this.spottedService.removeLike(id, user.userId);
    return { ok: true, statusCode: 200 };
  }
}
