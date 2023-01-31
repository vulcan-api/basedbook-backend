import { Controller, Get } from '@nestjs/common';

@Controller('/auth')
export class AuthController {
  @Get()
  indexResponse(): string {
    return 'auth is under construction. Stay tuned';
  }
}
