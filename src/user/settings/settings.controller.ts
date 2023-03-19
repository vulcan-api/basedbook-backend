import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SettingsService } from './settings.service';
import { GetUser } from '../../auth/decorator/getUser.decorator';
import { JwtAuthDto } from '../../auth/dto/jwt-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { SettingsDto } from './dto/settings.dto';

@Controller('user/settings')
@UseGuards(AuthGuard('jwt'))
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}
  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FileInterceptor('avatar'))
  async updateSettings(
    @Body() settings: SettingsDto,
    @GetUser() user: JwtAuthDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /\.jpg|jpeg|png$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    avatar?: Express.Multer.File,
  ): Promise<void> {
    await this.settingsService.updateSettings(avatar, user.userId, settings);
  }
  @Get('get')
  async getSettings(@GetUser() user: JwtAuthDto): Promise<object> {
    return await this.settingsService.getSettings(user.userId);
  }
  @Get('avatar/:id')
  async getAvatar(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<Buffer | null> {
    return await this.settingsService.getAvatar(userId);
  }
}
