import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { InsertPostDto } from './dto/insertPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';

@Injectable()
export class SpottedService {
  constructor(private readonly prisma: DbService) {}

  async getPostList(
    skip: number,
    take: number,
    userId: number,
  ): Promise<any[]> {
    const { prisma } = this;

    const spottedPosts: any[] = await prisma.$queryRaw`
        SELECT s.id,
       "createdAt",
       title,
       text,
       u.username,
       "isAnonymous",
       (SELECT count(l) FROM "SpottedLikes" l WHERE l."postId" = s.id) AS "likes",
       (SELECT count(l) FROM "SpottedLikes" l WHERE l."postId" = s.id AND l."userId" = ${userId}) AS "isLiked"
            FROM "SpottedPost" s 
            LEFT JOIN "SpottedLikes" l ON s.id = l."postId" 
            LEFT JOIN "User" u ON s."authorId" = u.id
            ORDER BY s."createdAt" desc
            OFFSET ${skip} LIMIT ${take}`;

    return spottedPosts.map((post: any) => {
      post.likes = parseInt(post.likes);
      post.isLiked = Boolean(parseInt(post.isLiked));
      return post;
    });
  }

  async getPostById(postId: number, userId: number): Promise<any> {
    const { prisma } = this;

    const spottedPosts: any[] = await prisma.$queryRaw`
        SELECT s.id,
       "createdAt",
       title,
       text,
       "authorId",
       "isAnonymous",
       (SELECT count(l) FROM "SpottedLikes" l WHERE l."postId" = s.id) AS "likes",
       (SELECT count(l) FROM "SpottedLikes" l WHERE l."postId" = s.id AND l."userId" = ${userId}) AS "isLiked"
            FROM "SpottedPost" s LEFT JOIN "SpottedLikes" l ON s.id = l."postId"
            WHERE s.id = ${postId}
            ORDER BY s."createdAt" desc`;

    return spottedPosts.map((post: any) => {
      post.likes = parseInt(post.likes);
      post.isLiked = Boolean(parseInt(post.isLiked));
      return post;
    })[0];
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

  async removeLike(postId: number, userId: number) {
    await this.prisma.spottedLikes.deleteMany({
      where: { postId, userId },
    });
  }
}
