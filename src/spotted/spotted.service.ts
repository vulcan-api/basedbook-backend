import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { InsertPostDto } from './dto/insertPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { postQueryTemplate } from './dto/postQuery.template';
import { Prisma } from '@prisma/client/scripts/default-index';

@Injectable()
export class SpottedService {
  constructor(private readonly prisma: DbService) {}

  processResponse(spottedPost: any): any {
    if (spottedPost.isAnonymous) delete spottedPost.author;

    spottedPost.likes = spottedPost._count.SpottedLikes;
    delete spottedPost._count;

    return spottedPost;
  }

  doesUserLikedPost(
    userId: number,
    postId: number,
  ): Prisma.PrismaPromise<number> {
    return this.prisma.spottedLikes.count({
      where: {
        userId,
        postId,
      },
    });
  }

  async getPostList(
    skip: number,
    take: number,
    userId: number,
  ): Promise<any[]> {
    const { prisma } = this;

    const spottedPosts: any[] = await prisma.$queryRaw`SELECT s.id,
       "createdAt",
       title,
       text,
       "authorId",
       "isAnonymous",
       (SELECT count(l) FROM "SpottedLikes" l WHERE l."postId" = s.id) AS "likes",
       (SELECT count(l) FROM "SpottedLikes" l WHERE l."postId" = s.id AND l."userId" = ${userId}) AS "isLiked"
            FROM "SpottedPost" s LEFT JOIN "SpottedLikes" l ON s.id = l."postId" 
            ORDER BY s."createdAt" desc`;

    return spottedPosts.map((post: any) => {
      post.likes = parseInt(post.likes);
      post.isLiked = Boolean(parseInt(post.isLiked));
      return post;
    });
  }

  async getPostById(id: number, userId: number): Promise<any> {
    const { prisma } = this;

    const [spottedPost, isLiked] = await prisma.$transaction([
      prisma.spottedPost.findUniqueOrThrow({
        where: { id },
        select: postQueryTemplate,
      }),
      this.doesUserLikedPost(userId, id),
    ]);
    Object.assign(spottedPost, isLiked);

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
    await this.prisma.spottedLikes
      .create({ data: { postId, userId } })
      .catch((err) => {
        console.error(err);
        throw new HttpException(
          `CONFLICT: user nr. ${userId} already liked post with id: ${postId}`,
          HttpStatus.CONFLICT,
        );
      });
  }

  /*
  async giveADislike(postId: number, userId: number) {
    await this.prisma.dislike
      .create({ data: { postId, userId } })
      .catch((err : any) => {
        console.error(err);
        throw new HttpException(
          `CONFLICT: user nr. ${userId} already liked post with id: ${postId}`,
          HttpStatus.CONFLICT,
        );
      });
  }
  */
}
