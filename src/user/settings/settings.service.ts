import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: DbService) {}
  async updateSettings(
    avatarFile: Express.Multer.File,
    userId: number,
  ): Promise<void> {
    await this.updateAvatar(avatarFile, userId);
  }

  async updateAvatar(
    avatarFile: Express.Multer.File,
    userId: number,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarFile.buffer },
    });
  }
}
