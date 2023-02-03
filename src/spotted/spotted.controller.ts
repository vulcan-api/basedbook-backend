import { SpottedService } from './spotted.service';
import { Controller, Get, Put, Query } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Controller('spotted')
export class SpottedController {
  constructor(private readonly spottedService: SpottedService) {}

  @Get('/post')
  async getAllPosts(@Query() param: any): Promise<any> {
    console.log('params: ', param);
    return await this.spottedService.getPostList(param);
  }

  @Put('post/add')
  addNewSpottedPost(): string {
    return 'to be continued';
  }
}
