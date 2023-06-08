import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TotpService } from './totp.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthDto } from '../dto/jwt-auth.dto';
import { GetUser } from '../decorator/getUser.decorator';
import { Response } from 'express';
import { AuthService } from '../auth.service';
import { TotpDto } from '../dto';

@Controller('auth/totp')
export class TotpController {
  constructor(
    private readonly totpService: TotpService,
    private readonly authService: AuthService,
  ) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('code')
  async getQrCodeUrl(
    @GetUser() user: JwtAuthDto,
  ): Promise<{ url: string | undefined }> {
    return this.totpService.getQrCodeUrl(user.userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify')
  async verifyTotpCode(
    @Body() dto: TotpDto,
    @Res() response: Response,
  ): Promise<void> {
    const jwt = await this.totpService.verify(dto.email, dto.code);
    response.cookie(...jwt);
    response.cookie(
      'user_info',
      JSON.stringify(await this.authService.getUserPublicInfo(dto.email)),
    );
    response.send({ token: jwt[1] });
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('is-enabled')
  async is2faEnabled(
    @GetUser() user: JwtAuthDto,
  ): Promise<{ is2faEnabled: boolean }> {
    return {
      is2faEnabled: await this.totpService.is2faEnabled(user.userId),
    };
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch('remove')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove2FA(@GetUser() user: JwtAuthDto) {
    await this.totpService.remove2FA(user.userId);
  }
}
