import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { DbService } from '../db/db.service';
import { sha512 } from 'js-sha512';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtAuthDto } from './dto/jwt-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { checkProfanity } from '../lib/profanity_filter/profanity_filter';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: DbService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: RegisterDto): Promise<object> {
    if (checkProfanity(dto.username))
      throw new ForbiddenException('Username contains profanity!');
    console.table({ username: dto.username });
    const sampleUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: dto.username }, { email: dto.email }],
      },
    });
    if (sampleUser) throw new ForbiddenException('Credentials taken!');

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        name: dto.name,
        surname: dto.surname,
        passwordHash: sha512(dto.password),
        profileDesc: '',
        email: dto.email,
      },
    });

    /* generating tempID */
    const tempUser = await this.prisma.unverifiedUser.create({
      data: {
        tempId: sha512(String(user.id)),
        userId: user.id,
      },
    });

    const emailHTML = `
      <html lang="pl">
        <body>
          <h1>Witaj na najlepszej platformie społecznościowej — Muj Elektryk!</h1>
          <p><a href="http://localhost:3000/auth/verify/${tempUser.tempId}">Potwierdź konto</a></p>
        </body>
      </html>
    `;
    /* sending confirmation email */
    this.mailerService.sendMail({
      to: dto.email,
      from: 'muj-elektryk@sevedev.com',
      subject: 'Potwierdzenie adresu email w serwisie BasedBook',
      html: emailHTML,
    });

    return { msg: 'Successfully registered a new account!' };
  }

  async login(dto: LoginDto): Promise<[string, string, object] | []> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { email: dto.email },
      include: {
        Roles: {
          select: { role: true },
        },
      },
    });

    if (sha512(dto.password) === user.passwordHash) {
      if (user.totpSecret === null)
        return this.generateAuthCookie({
          isBanned: user.isBanned,
          roles: user.Roles.map((e) => e.role),
          userId: user.id,
        });
      return [];
    }
    throw new ForbiddenException('Wrong credentials!');
  }

  async verify(id: string): Promise<[string, string, object]> {
    const unverifiedUser = await this.prisma.unverifiedUser.findUniqueOrThrow({
      where: { tempId: id },
      include: {
        user: {
          select: {
            isBanned: true,
            totpSecret: true,
            Roles: { select: { role: true } },
          },
        },
      },
    });

    await this.prisma.user.update({
      where: { id: unverifiedUser.userId },
      data: { isVerified: true },
    });

    await this.prisma.unverifiedUser.delete({
      where: { tempId: id },
    });

    return this.generateAuthCookie({
      userId: unverifiedUser.userId,
      isBanned: unverifiedUser.user.isBanned,
      roles: unverifiedUser.user.Roles.map((e) => e.role),
    });
  }

  async isTaken(username: string, email: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
    return Boolean(user);
  }

  async generateAuthJwt(payload: JwtAuthDto): Promise<string> {
    console.log('payload: ', payload);
    return this.jwtService.sign(payload);
  }

  async generateAuthCookie(
    payload: Omit<JwtAuthDto, 'roles'> & {
      roles?: typeof JwtAuthDto.prototype.roles;
    },
  ): Promise<[string, string, object]> {
    if (payload.roles === undefined) payload.roles = ['USER'];
    const jwt = await this.generateAuthJwt(payload as JwtAuthDto);
    return ['jwt', jwt, { secure: true, sameSite: 'none' }];
  }

  async getUserPublicInfo(email: string): Promise<object> {
    const { prisma } = this;
    const userPublicInfo: any = await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        surname: true,
        username: true,
        class_name: true,
        profileDesc: true,
        _count: {
          select: {
            Followers: true,
            Following: true,
          },
        },
        Roles: { select: { role: true } },
        isBanned: true,
      },
    });
    userPublicInfo.followers = userPublicInfo._count.Followers;
    userPublicInfo.following = userPublicInfo._count.Following;
    delete userPublicInfo._count;

    userPublicInfo.Roles = userPublicInfo.Roles.map((e: any) => e.role);

    return userPublicInfo;
  }

  async sendResetEmail(email: string): Promise<void> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    const emailContent = `
      <html lang="pl">
        <body>
          <h1>Aby zresetować hasło kliknij w poniższy link</h1> 
          <a href="http://localhost:3000/auth/reset/${sha512(
            String(user.id),
          )}">Zresetuj hasło</a>
        </body>
      </html>
    `;
    const passwordResetRequest =
      await this.prisma.passwordResetRequest.findUnique({
        where: {
          userId: user.id,
        },
      });
    if (!passwordResetRequest) {
      await this.prisma.passwordResetRequest.create({
        data: {
          userId: user.id,
          hash: sha512(String(user.id)),
        },
      });
    }
    this.mailerService.sendMail({
      to: email,
      from: 'muj-elektryk@sevedev.com',
      subject: 'Zmiana hasła w serwisie BasedBook',
      html: emailContent,
    });
  }

  async resetPassword(userHash: string, newPassword: string): Promise<void> {
    const resetRequest =
      await this.prisma.passwordResetRequest.findUniqueOrThrow({
        where: {
          hash: userHash,
        },
      });
    await this.prisma.user.update({
      where: {
        id: resetRequest.userId,
      },
      data: {
        passwordHash: sha512(newPassword),
      },
    });
  }
}
