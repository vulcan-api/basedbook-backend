import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { RegisterDto } from '../dto';
import { AuthService } from '../auth.service';
import { Response } from 'express';

@Controller('auth/register')
export class RegisterController {
  constructor(private authService: AuthService) {}
  @Get()
  handleGetRequest(): string {
    return 'If you want to get login page, you should use our React app instead of nestjs API ;)';
  }

  @Post()
  async register(
    @Body() dto: RegisterDto,
    @Res() res: Response,
  ): Promise<Response> {
    return (await this.authService.signup(dto, res)).send();
  }
}
