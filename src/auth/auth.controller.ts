import { Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { IsTakenDto } from './dto/is-taken.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('isTaken')
  async isTaken(dto: IsTakenDto): Promise<boolean> {
    return this.authService.isTaken(dto.username, dto.email);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('jwt');
    res.clearCookie('user_info');
    res.send({ statusCode: true, message: 'Logout success' });
  }
}
