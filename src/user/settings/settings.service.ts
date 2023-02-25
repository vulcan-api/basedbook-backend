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
        profileDesc: settings.description,
        darkTheme: settings.theme,
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
}
