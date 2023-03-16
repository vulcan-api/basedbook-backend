import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { DbService } from '../db/db.service';
import { sha512 } from 'js-sha512';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtAuthDto } from './dto/jwt-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: DbService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: RegisterDto): Promise<object> {
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
       <h1>Witaj na najlepszej platformie społecznościowej — Muj Elektryk!</h1>
       <p><a href="http://localhost:3000/auth/verify/${tempUser.tempId}">Potwierdź konto</a></p>
    `;
    /* sending confirmation email */
    await this.mailerService.sendMail({
      to: dto.email,
      from: 'noreply@basedbook.com',
      subject: 'Potwierdzenie adresu email w serwisie BasedBook',
      html: emailHTML,
    });

    return { msg: 'Successfully registered a new account!' };
  }

  async login(dto: LoginDto): Promise<[string, string, object]> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { email: dto.email },
    });

    if (sha512(dto.password) === user.passwordHash) {
      return this.generateAuthCookie({ userId: user.id, role: user.role });
    }
    throw new ForbiddenException('Wrong credentials!');
  }

  async verify(id: string): Promise<[string, string, object]> {
    const unverifiedUser = await this.prisma.unverifiedUser.findUniqueOrThrow({
      where: { tempId: id },
    });

    await this.prisma.user.update({
      where: { id: unverifiedUser.userId },
      data: { isVerified: true },
    });

    await this.prisma.unverifiedUser.delete({
      where: { tempId: id },
    });

    return this.generateAuthCookie({ userId: unverifiedUser.userId });
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
    payload: Omit<JwtAuthDto, 'role'> & { role?: string },
  ): Promise<[string, string, object]> {
    if (payload.role === undefined) payload.role = 'USER';
    const jwt = await this.generateAuthJwt(payload as JwtAuthDto);
    return ['jwt', jwt, { secure: true }];
  }

  async getUserPublicInfo(email: string): Promise<object | null> {
    const { prisma } = this;
    const userPublicInfo: any = await prisma.user.findUnique({
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
        role: true,
      },
    });
    if (!userPublicInfo) return null;
    userPublicInfo.followers = userPublicInfo._count.Followers;
    userPublicInfo.following = userPublicInfo._count.Following;
    delete userPublicInfo._count;

    return userPublicInfo;
  }

  async sendResetEmail(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) return;
    const emailContent = `
      <h1>Aby zresetować hasło kliknij w poniższy link</h1> 
      <a href="http://localhost:3000/auth/reset/${user.email}">Zresetuj hasło</a>
    `;
    await this.mailerService.sendMail({
      to: email,
      from: 'noreply@basedbook.com',
      subject: 'Zmiana hasła w serwisie BasedBook',
      html: emailContent,
    });
  }

  async resetPassword(newPassword: string, email: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        passwordHash: sha512(newPassword),
      },
    });
  }
}
