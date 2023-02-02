import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto';

@Controller('auth/login')
export class LoginController {
  constructor(private authService: AuthService) {}
  @Get()
  handleGetRequest(): string {
    return 'If you want to get login page, you should use our React app instead of nestjs API ;)';
  }
  @Post()
  login(@Body() dto: LoginDto): object {
    return this.authService.login(dto);
  }
}
