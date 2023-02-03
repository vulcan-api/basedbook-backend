import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { PostDto, UpdatePostDto } from './dto/post.dto';

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

  async insertNewPost(postData: PostDto) {
    await this.prisma.spottedPost.create({ data: postData });
  }

  async changePostById(newPostData: UpdatePostDto) {
    console.log('newPostData: ', newPostData);
    const { id } = newPostData;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete newPostData.id;
    await this.prisma.spottedPost.update({
      data: newPostData,
      where: { id },
    });
    return 'xd';
  }

  async deletePostById(id: number) {
    await this.prisma.spottedPost.delete({ where: { id } });
  }
}
