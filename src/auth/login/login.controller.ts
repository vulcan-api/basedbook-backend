import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth/login')
export class LoginController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const jwt = await this.authService.login(dto);
    if (!jwt.length) {
      res.send({ has2FAEnabled: true });
      return;
    }
    res.cookie(...jwt);
    res.cookie(
      'user_info',
      JSON.stringify(await this.authService.getUserPublicInfo(dto.email)),
      {
        domain: this.configService.get<string>('COOKIE_DOMAIN', 'localhost'),
        secure: true,
        sameSite: 'lax',
      },
    );
    res.send({ token: jwt[1] });
  }
}
