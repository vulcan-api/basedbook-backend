import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';

@Injectable()
export class FriendsService {
  constructor(private readonly prisma: DbService) {}

  async getAllUserFriends(userId: number): Promise<object[]> {
    return this.prisma.user.findMany({
      where: { id: userId },
      select: {
        Friends: {
          where: { isAccepted: true },
          select: {
            friend: {
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

  async sendInvitation(inviterId: number, friendToInviteId: number) {
    await this.prisma.friends.create({
      data: {
        friendId: inviterId,
        friendRelId: friendToInviteId,
      },
    });
  }

  async acceptInvitation(userId: number, friendId: number) {
    await this.prisma.friends.updateMany({
      where: {
        friendId: { in: [userId, friendId] },
        friendRelId: { in: [userId, friendId] },
      },
      data: { isAccepted: true },
    });
  }

  async removeFriendship(userId: number, friendId: number) {
    await this.prisma.friends.deleteMany({
      where: {
        friendId: { in: [userId, friendId] },
        friendRelId: { in: [userId, friendId] },
      },
    });
  }
}
