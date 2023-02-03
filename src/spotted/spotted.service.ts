import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class SpottedService {
  constructor(private readonly prisma: DbService) {}

  async getPostList(fieldsArray: object): Promise<any> {
    const { prisma } = this;

    const posts = prisma.spottedPost.findMany({ select: { id: true } });

    return posts;
  }
}
