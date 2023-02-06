import { Controller, Get, Post, Body } from '@nestjs/common';
import { RegisterDto } from '../dto';
import { AuthService } from '../auth.service';

@Controller('auth/register')
export class RegisterController {
  constructor(private authService: AuthService) {}
  @Get()
  handleGetRequest(): string {
    return 'If you want to get login page, you should use our React app instead of nestjs API ;)';
  }
  @Post()
  async register(@Body() dto: RegisterDto): Promise<object> {
    return this.authService.signup(dto);
  }
}
