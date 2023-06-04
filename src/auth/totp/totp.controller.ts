import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TotpService } from './totp.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthDto } from '../dto/jwt-auth.dto';
import { GetUser } from '../decorator/getUser.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('auth/totp')
export class TotpController {
  constructor(private readonly totpService: TotpService) {}
  @Get('code')
  async getQrCodeUrl(
    @GetUser() user: JwtAuthDto,
  ): Promise<{ url: string | undefined }> {
    return this.totpService.getQrCodeUrl(user.userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify')
  async verifyTotpCode(
    @GetUser() user: JwtAuthDto,
    @Body('code') code: string,
  ): Promise<void> {
    if (!code) throw new BadRequestException('Code must not be empty!');
    if (!(await this.totpService.verify(user.userId, code)))
      throw new NotFoundException('The TOTP code is incorrect');
  }

  @Get('is-enabled')
  async is2faEnabled(
    @GetUser() user: JwtAuthDto,
  ): Promise<{ is2faEnabled: boolean }> {
    return {
      is2faEnabled: await this.totpService.is2faEnabled(user.userId),
    };
  }
}
