import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/getUser.decorator';

@Controller('/auth')
export class AuthController {
  // Route bellow is only for testing reasons
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async indexResponse(@GetUser() user: any): Promise<string> {
    console.log('req.user: ', user);
    return user;
  }
}
