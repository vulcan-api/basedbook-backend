import { SpottedService } from './spotted.service';
import { Controller, Get, Param, Put } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Controller('spotted')
export class SpottedController {
  constructor(
    private readonly spottedService: SpottedService,
    private readonly db: DbService,
  ) {}

  @Get('/post')
  async getAllPosts(@Param() param: string[]): Promise<any> {
    return await this.spottedService.getPostList(param);
  }

  @Put('post/add')
  addNewSpottedPost(): string {
    return 'to be continued';
  }
}
