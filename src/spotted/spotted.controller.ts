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

/*
 * TODO:
 *  All of endpoints bellow are very unsecure
 *  There is no ownership validation and this will be changed
 *  when jwt validation middleware will be done
 * */

@Controller('spotted')
export class SpottedController {
  constructor(private readonly spottedService: SpottedService) {}

  @Get('/post')
  getAllPosts(
    @Query('skip') skip = '0',
    @Query('take') take = '10',
  ): Promise<object> {
    return this.spottedService.getPostList(parseInt(skip), parseInt(take));
  }

  @Get('/post/:id')
  getSpecificPost(@Param('id') id: string): object {
    return this.spottedService.getPostById(parseInt(id));
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
    @Body('id') id: number,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    await this.spottedService.giveALike(id, user.userId);
    return { ok: true, statusCode: 200 };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/post/:id/dislike')
  async giveADislike(
    @Body('id') postId: number,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    await this.spottedService.giveADislike(postId, user.userId);
    return { ok: true, statusCode: 200 };
  }
}
