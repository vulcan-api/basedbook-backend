import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FacebookService } from './facebook.service';
import { GetUser } from '../../auth/decorator/getUser.decorator';
import { FacebookUser } from './facebook.strategy';
import { AuthService } from '../../auth/auth.service';
import { Response } from 'express';

@UseGuards(AuthGuard('facebook'))
@Controller('oauth/facebook')
export class FacebookController {
  constructor(
    private readonly facebookService: FacebookService,
    private readonly authService: AuthService,
  ) {}
  @UseGuards(AuthGuard('facebook'))
  @Get()
  async facebookLogin(): Promise<number> {
    return HttpStatus.OK;
  }
  @Get('callback')
  @HttpCode(HttpStatus.OK)
  async facebookCallback(
    @GetUser() user: FacebookUser,
    @Res() response: Response,
  ): Promise<void> {
    const userId = await this.facebookService.registerFacebookUser(user);
    const jwt = await this.authService.generateAuthCookie({
      userId,
      role: 'USER',
    });
    response.cookie(...jwt);
    response.send({ token: jwt[1] });
  }
}
