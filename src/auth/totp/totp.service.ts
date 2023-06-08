import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import { DbService } from '../../db/db.service';
import { AuthService } from '../auth.service';

@Injectable()
export class TotpService {
  constructor(
    private readonly prisma: DbService,
    private readonly authService: AuthService,
  ) {}
  async getQrCodeUrl(userId: number): Promise<{ url: string | undefined }> {
    const secret = speakeasy.generateSecret({
      name: 'BasedBook',
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        totpSecret: secret.base32,
      },
    });
    return {
      url: secret.otpauth_url,
    };
  }

  async verify(
    email: string,
    userToken: string,
  ): Promise<[string, string, object]> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
      select: {
        totpSecret: true,
        isBanned: true,
        Roles: true,
        id: true,
      },
    });

    if (
      !speakeasy.totp.verify({
        secret: user.totpSecret ?? '',
        encoding: 'base32',
        token: userToken,
      })
    )
      throw new HttpException(
        'The TOTP code is incorrect!',
        HttpStatus.NOT_FOUND,
      );

    return this.authService.generateAuthCookie({
      userId: user.id,
      isBanned: user.isBanned,
      roles: user.Roles.map((e) => e.role),
    });
  }
  async is2faEnabled(userId: number): Promise<boolean> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });
    return !!user.totpSecret;
  }
  async remove2FA(userId: number) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        totpSecret: null,
      },
    });
  }
}
