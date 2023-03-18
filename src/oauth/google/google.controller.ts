import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../auth/decorator/getUser.decorator';
import { GoogleUser } from './google.strategy';
import { Response } from 'express';
import { AuthService } from '../../auth/auth.service';
import { GoogleService } from './google.service';

@Controller('oauth/google')
export class GoogleController {
  constructor(
    private readonly googleService: GoogleService,
    private readonly authService: AuthService,
  ) {}
  @UseGuards(AuthGuard('google'))
  @Get()
  async googleAuthentificate(): Promise<number> {
    return HttpStatus.OK;
  }

  @UseGuards(AuthGuard('google'))
  @Get('callback')
  async googleAuthentificateCallback(
    @GetUser() user: GoogleUser,
    @Res() response: Response,
  ): Promise<void> {
    const userId = await this.googleService.registerGoogleUser(user);
    const jwt = await this.authService.generateAuthCookie({
      userId,
    });
    response.cookie(...jwt);
    response.send({ token: jwt[1] });
  }
}
