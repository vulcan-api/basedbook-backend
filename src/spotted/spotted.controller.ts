import { SpottedService } from './spotted.service';
import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { NewSpottedPostDto } from './dto/newSpottedPost.dto';

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

  @Put('post/add')
  async addNewSpottedPost(@Body() body: NewSpottedPostDto): Promise<object> {
    await this.spottedService.insertNewPost(body);
    return { ok: true };
  }
}
