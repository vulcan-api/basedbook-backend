import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { NewSpottedPostDto } from './dto/newSpottedPost.dto';

@Injectable()
export class SpottedService {
  constructor(private readonly prisma: DbService) {}

  getPostList(skip: number, take: number): Promise<any> {
    return this.prisma.spottedPost.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  getPostById(id: number): Promise<any> {
    return this.prisma.spottedPost.findUnique({ where: { id } });
  }

  async insertNewPost(postData: NewSpottedPostDto) {
    await this.prisma.spottedPost.create({ data: postData });
  }
}
