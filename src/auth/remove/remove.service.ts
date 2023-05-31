import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';
@Injectable()
export class RemoveService {
  constructor(private readonly prisma: DbService) {}
  async removeUser(userId: number): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
