import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Get()
  async indexResponse(@Req() req: any): Promise<any> {
    //return 'auth is under construction. Stay tuned';
    //return await this.authService.generateAuthJwt({ userId: 2137 });
    return req.user;
  }
}
