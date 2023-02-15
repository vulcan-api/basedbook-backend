import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto';
import { Response } from 'express';

@Controller('auth/login')
export class LoginController {
  constructor(private readonly authService: AuthService) {}
  @Get()
  handleGetRequest(): string {
    return 'If you want to get login page, you should use our React app instead of nestjs API ;)';
  }
  @Post()
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const jwt = await this.authService.login(dto);
    res.cookie(...jwt);
    res.cookie(
      'user_info',
      JSON.stringify(await this.authService.getUserPublicInfo(dto.email)),
    );
    res.send({ token: jwt[1] });
  }
}
