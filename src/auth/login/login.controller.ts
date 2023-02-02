import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto';
import { Response } from 'express';

@Controller('auth/login')
export class LoginController {
  constructor(private authService: AuthService) {}
  @Get()
  handleGetRequest(): string {
    return 'If you want to get login page, you should use our React app instead of nestjs API ;)';
  }
  @Post()
  async login(@Body() dto: LoginDto, @Res() res: Response): Promise<Response> {
    return (await this.authService.login(dto, res)).send();
  }
}
