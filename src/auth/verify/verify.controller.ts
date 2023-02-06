import { Controller, Get, Param, Res } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Response } from 'express';

@Controller('auth/verify')
export class VerifyController {
  constructor(private readonly auth: AuthService) {}
  @Get(':tempID')
  async verify(
    @Param('tempID') tempId: string,
    @Res() res: Response,
  ): Promise<Response> {
    return (await this.auth.verify(tempId, res)).send();
  }
}
