import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { SettingsDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: DbService) {}
  async updateSettings(
    avatarFile: Express.Multer.File | undefined,
    userId: number,
    settings: SettingsDto,
  ): Promise<void> {
    if (avatarFile) await this.updateAvatar(avatarFile, userId);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        username: settings.username,
        email: settings.email,
        name: settings.name,
        surname: settings.surname,
        facebook: settings.facebook,
        instagram: settings.instagram,
        youtube: settings.youtube,
        website: settings.website,
        profileDesc: settings.profileDesc,
      },
    });
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

  async getSettings(userId: number): Promise<object> {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        username: true,
        email: true,
        name: true,
        surname: true,
        facebook: true,
        instagram: true,
        youtube: true,
        website: true,
        profileDesc: true,
      },
    });
  }
  async getAvatar(userId: number): Promise<Buffer | null> {
    return this.prisma.user
      .findUniqueOrThrow({
        where: { id: userId },
        select: { avatar: true },
      })
      .then((user) => user.avatar);
  }
}
