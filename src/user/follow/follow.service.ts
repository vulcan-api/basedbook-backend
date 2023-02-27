import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';

@Injectable()
export class FollowService {
  constructor(private readonly prisma: DbService) {}

  async getAllFollowing(userId: number): Promise<object[]> {
    return this.prisma.user.findMany({
      where: { id: userId },
      select: {
        Following: {
          select: {
            following: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });
  }

  async getAllFollowers(userId: number): Promise<object[]> {
    return this.prisma.user.findMany({
      where: { id: userId },
      select: {
        Followers: {
          select: {
            follower: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });
  }

  async followUser(userId: number, userToFollowId: number) {
    await this.prisma.follows.create({
      data: {
        followerId: userId,
        followingId: userToFollowId,
      },
    });
  }

  async unfollowUser(userId: number, userToUnfollowId: number) {
    await this.prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: userToUnfollowId,
        },
      },
    });
  }
}
