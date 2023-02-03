import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { NewSpottedPostDto } from './dto/newSpottedPost.dto';

@Injectable()
export class SpottedService {
  constructor(private readonly prisma: DbService) {}

  getPostList(): Promise<any> {
    return this.prisma.spottedPost.findMany();
  }

  getPostById(id: number): Promise<any> {
    return this.prisma.spottedPost.findUnique({ where: { id } });
  }

  async insertNewPost(postData: NewSpottedPostDto) {
    await this.prisma.spottedPost.create({ data: postData });
  }
}
