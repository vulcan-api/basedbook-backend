import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { InsertPostDto } from './dto/insertPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { postQueryTemplate } from './dto/postQuery.template';

@Injectable()
export class SpottedService {
  constructor(private readonly prisma: DbService) {}

  processResponse(spottedPost: any): any {
    if (spottedPost.isAnonymous) delete spottedPost.author;

    spottedPost.likes = spottedPost._count.Like;
    spottedPost.dislikes = spottedPost._count.Dislike;
    delete spottedPost._count;

    return spottedPost;
  }

  async getPostList(skip: number, take: number): Promise<any> {
    const spottedPost = await this.prisma.spottedPost.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      select: postQueryTemplate,
    });

    return spottedPost.map(this.processResponse);
  }

  async getPostById(id: number): Promise<any> {
    const spottedPost = await this.prisma.spottedPost.findUnique({
      where: { id },
      select: postQueryTemplate,
    });
    return this.processResponse(spottedPost);
  }

  async insertNewPost(postData: InsertPostDto, authorId: number) {
    await this.prisma.spottedPost.create({
      data: Object.assign(postData, { authorId }),
    });
  }

  async changePostById(
    newPostData: UpdatePostDto | { id?: number },
    userId: number,
  ) {
    console.log('newPostData: ', newPostData);
    const { id } = newPostData;
    delete newPostData.id;

    await this.prisma.spottedPost.updateMany({
      data: newPostData,
      where: { id, authorId: userId },
    });
  }

  async deletePostById(id: number, userId: number) {
    await this.prisma.spottedPost.deleteMany({
      where: { id, authorId: userId },
    });
  }

  async giveALike(postId: number, userId: number) {
    await this.prisma.like.create({ data: { postId, userId } }).catch((err) => {
      console.error(err);
      throw new HttpException(
        `CONFLICT: user nr. ${userId} already liked post with id: ${postId}`,
        HttpStatus.CONFLICT,
      );
    });
  }

  async giveADislike(postId: number, userId: number) {
    await this.prisma.dislike
      .create({ data: { postId, userId } })
      .catch((err) => {
        console.error(err);
        throw new HttpException(
          `CONFLICT: user nr. ${userId} already liked post with id: ${postId}`,
          HttpStatus.CONFLICT,
        );
      });
  }
}
