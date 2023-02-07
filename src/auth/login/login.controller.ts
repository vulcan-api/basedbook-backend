import { Body, Controller, Get, Post, Res } from '@nestjs/common';
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
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    /* TODO:
        currently this works as example
     *  We need to make real login route
     */
    //return (await this.authService.login(dto, res)).send();
    const jwt = await this.authService.generateAuthCookie({ userId: 2137 });
    res.cookie(...jwt);
    res.send({ token: jwt[1] });
  }
}
