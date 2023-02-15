import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/getUser.decorator';
import { Response } from 'express';

@Controller('/auth')
export class AuthController {
  // Route bellow is only for testing reasons
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async indexResponse(@GetUser() user: any): Promise<string> {
    console.log('req.user: ', user);
    return user;
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('jwt');
    res.clearCookie('user_info');
    res.send({ statusCode: true, message: 'Logout success' });
  }
}
