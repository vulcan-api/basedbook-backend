import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { PostDto, UpdatePostDto } from './dto/post.dto';

@Injectable()
export class SpottedService {
  constructor(private readonly prisma: DbService) {}

  private readonly spottedPostSelectTemplate = {
    _count: {
      select: {
        Like: true,
        Dislike: true,
      },
    },
  };

  getPostList(skip: number, take: number): Promise<any> {
    return this.prisma.spottedPost.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      select: this.spottedPostSelectTemplate,
    });
  }

  getPostById(id: number): Promise<any> {
    return this.prisma.spottedPost.findUnique({
      where: { id },
      select: this.spottedPostSelectTemplate,
    });
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

  async giveALike(id: number, userId: number) {
    await this.prisma.like.create({
      data: {
        postId: id,
        userId,
      },
    });
  }

  async giveADislike(id: number, userId: number) {
    await this.prisma.dislike.create({
      data: {
        postId: id,
        userId,
      },
    });
  }
}
