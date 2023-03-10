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

    const spottedPosts = await prisma.spottedPost.findMany({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        createdAt: true,
        title: true,
        text: true,
        isAnonymous: true,
        author: {
          select: {
            username: true,
            id: true,
          },
        },
        Comment: true,
        SpottedLikes: true,
      },
    });

    return spottedPosts.map((post: any) => {
      post.isOwned = post.author.id === userId;
      if (post.isAnonymous) delete post.author;

      post.likes = post.SpottedLikes.length;
      post.isLiked = post.SpottedLikes.some(
        (like: any) => like.userId === userId,
      );
      post.comments = this.nestReplies(post.Comment);
      delete post.Comment;
      console.log(post.comments);
      return post;
    });
  }

  private nestReplies(comments: any[], parentId?: number): object | null {
    let processingComments: any[];
    if (!parentId) {
      processingComments = comments.filter((comment) => !comment.parentId);
    } else {
      processingComments = comments.filter(
        (comment) => comment.parentId === parentId,
      );
    }
    const answer: any = {};

    processingComments.forEach((processingElement) =>
      comments.splice(
        comments.findIndex((e: any) => e === processingElement),
        1,
      ),
    );

    processingComments.forEach((processingElement) => {
      answer[processingElement.id] = Object.assign(processingElement, {
        replies: this.nestReplies(comments, processingElement.id),
      });
    });
    if (!Object.keys(answer).length) return null;
    return answer;
  }

  async getUsersPosts(skip: number, take: number, userId: number) {
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
            WHERE "isAnonymous" = false AND s."authorId" = ${userId}
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

  async addComment(
    postId: number,
    userId: number,
    text: string,
    commentId?: number,
  ): Promise<void> {
    await this.prisma.comment.create({
      data: {
        authorId: userId,
        postId,
        text,
        parentId: commentId,
      },
    });
  }

  async deleteComment(commentId: number, userId: number): Promise<void> {
    await this.prisma.comment.deleteMany({
      where: { id: commentId, authorId: userId },
    });
  }

  async report(
    postId: number,
    userId: number,
    reason: string,
  ): Promise<object> {
    await this.prisma.report.create({
      data: {
        userId,
        spottedPostId: postId,
        reason,
      },
    });
    return { msg: 'Successfully reported the post' };
  }
}
