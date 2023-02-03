import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
import { SpottedService } from './spotted.service';
import { PostDto, UpdatePostDto } from './dto/post.dto';

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
    await this.spottedService.changePost(body);
    return { ok: true, statusCode: 200 };
  }
}
