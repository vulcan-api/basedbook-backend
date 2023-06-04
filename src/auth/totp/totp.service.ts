import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import { DbService } from '../../db/db.service';

@Injectable()
export class TotpService {
  constructor(private readonly prisma: DbService) {}
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

  async verify(userId: number, userToken: string): Promise<boolean> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: {
        totpSecret: true,
      },
    });

    return speakeasy.totp.verify({
      secret: user.totpSecret ?? '',
      encoding: 'base32',
      token: userToken,
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
}
