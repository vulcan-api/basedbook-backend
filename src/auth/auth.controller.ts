import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('/auth')
export class AuthController {
  // Route bellow is only for testing reasons
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async indexResponse(@Req() req: any): Promise<string> {
    console.log('req.user: ', req.user);
    return req.user;
  }
}
