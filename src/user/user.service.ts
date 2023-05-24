import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class UserService {
  constructor(private prisma: DbService) {}

  async getPublicInformation(
    id: number,
    userId: number | undefined,
  ): Promise<object> {
    const userPublicInformation: any = await this.prisma.user.findUniqueOrThrow(
      {
        where: { id },
        select: {
          name: true,
          surname: true,
          username: true,
          profileDesc: true,
          email: true,
          Followers: true,
          Following: true,
          youtube: true,
          facebook: true,
          instagram: true,
          website: true,
        },
      },
    );

    userPublicInformation.isAlreadyFollowed =
      userPublicInformation.Followers.some(
        (following: any) => following.followerId === userId,
      );
    userPublicInformation.Followers = userPublicInformation.Followers.length;
    userPublicInformation.Following = userPublicInformation.Following.length;

    return userPublicInformation;
  }

  async findUsersByUserName(name: string): Promise<object[]> {
    return this.prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: name,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: name,
              mode: 'insensitive',
            },
          },
          {
            surname: {
              contains: name,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        surname: true,
        username: true,
      },
    });
  }

  async deleteAccount(userId: number) {
    if (!userId) throw new Error('UserId required');
    await this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async banUser(userId: number) {
    if (!userId) throw new Error("UserId shouldn't be empty");
    await this.prisma.user.update({
      where: { id: userId },
      data: { isBanned: true },
    });
  }
}
