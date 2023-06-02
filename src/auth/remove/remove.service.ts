import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { sha512 } from 'js-sha512';
@Injectable()
export class RemoveService {
  constructor(private readonly prisma: DbService) {}

  async checkIfUserExists(userId: number, password: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        passwordHash: true,
      },
    });
    if (!user) {
      return false;
    }
    return sha512(password) === user.passwordHash;
  }
  async removeUser(userId: number): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
