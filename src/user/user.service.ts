import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class UserService {
  constructor(private prisma: DbService) {}

  async getPublicInformation(id: number): Promise<object> {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        name: true,
        surname: true,
        username: true,
        class_name: true,
        profileDesc: true,
        email: true,
      },
    });
  }
}
