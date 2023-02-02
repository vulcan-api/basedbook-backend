import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class SpottedService {
  constructor(private readonly prisma: DbService) {}

  getPostList(fieldsArray: string[]): Promise<any> {
    const { prisma } = this;
    let posts: any;

    if (!fieldsArray.length) {
      const fields: any = {};
      for (const fieldName in fieldsArray) fields[fieldName] = true;

      posts = prisma.spottedPost.findMany({ select: fields });
    } else {
      posts = prisma.spottedPost.findMany();
    }

    return posts;
  }

  addNewPost() {}
}
