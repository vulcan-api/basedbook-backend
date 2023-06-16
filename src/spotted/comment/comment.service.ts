import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { filterProfanity } from '../../lib/profanity_filter/profanity_filter';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: DbService) {}

  async addComment(
    postId: number,
    userId: number,
    text: string,
    commentId?: number,
  ): Promise<void> {
    text = filterProfanity(text);
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
}
