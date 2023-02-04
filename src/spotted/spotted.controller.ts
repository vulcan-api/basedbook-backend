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
} from '@nestjs/common';
import { SpottedService } from './spotted.service';
import { PostDto, UpdatePostDto } from './dto/post.dto';

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

  @Put('/post')
  async addNewSpottedPost(@Body() body: PostDto): Promise<object> {
    await this.spottedService.insertNewPost(body);
    return { ok: true, statusCode: 200 };
  }

  @Patch('/post')
  async changePostData(@Body() body: UpdatePostDto): Promise<object> {
    await this.spottedService.changePostById(body);
    return { ok: true, statusCode: 200 };
  }

  @Delete('/post')
  async deletePost(@Body('id') id: number): Promise<object> {
    await this.spottedService.deletePostById(id);
    return { ok: true, statusCode: 200 };
  }

  @Post('/post/:id/like')
  async giveALike(@Body('id') id: number): Promise<object> {
    await this.spottedService.giveALike(id, 8);
    return { ok: true, statusCode: 200 };
  }

  @Post('/post/:id/dislike')
  async giveADislike(@Body('id') id: number): Promise<object> {
    await this.spottedService.giveADislike(id, 8);
    return { ok: true, statusCode: 200 };
  }
}
