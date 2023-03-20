import { Injectable } from '@nestjs/common';
import { GoogleUser } from './google.strategy';
import { DbService } from '../../db/db.service';
import { FacebookService } from '../facebook/facebook.service';

@Injectable()
export class GoogleService {
  constructor(
    private readonly prisma: DbService,
    private readonly randomUsernameService: FacebookService,
  ) {}
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
          username: await this.randomUsernameService.getRandomUsername(),
          passwordHash: '',
          profileDesc: '',
          googleId: user.id,
        },
      })
    ).id;
  }
}
