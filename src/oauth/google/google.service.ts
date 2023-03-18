import { Injectable } from '@nestjs/common';
import { GoogleUser } from './google.strategy';
import { DbService } from '../../db/db.service';

@Injectable()
export class GoogleService {
  constructor(private readonly prisma: DbService) {}
  async registerGoogleUser(user: GoogleUser): Promise<number> {
    const usr = await this.prisma.user.findUnique({
      where: { googleId: user.id },
      select: { id: true },
    });
    if (usr) return usr.id;
    return (
      await this.prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          surname: user.surname,
          username: user.username,
          passwordHash: '',
          profileDesc: '',
        },
      })
    ).id;
  }
}
