import {
  Controller,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SettingsService } from './settings.service';
import { GetUser } from '../../auth/decorator/getUser.decorator';
import { JwtAuthDto } from '../../auth/dto/jwt-auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user/settings')
@UseGuards(AuthGuard('jwt'))
export class SettingsController {
  constructor(private readonly settingService: SettingsService) {}
  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FileInterceptor('avatar'))
  async updateSettings(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /\.jpg|jpeg|png$/ }),
        ],
      }),
    )
    avatar: Express.Multer.File,
    @GetUser() user: JwtAuthDto,
  ): Promise<void> {
    await this.settingService.updateSettings(avatar, user.userId);
  }
}
