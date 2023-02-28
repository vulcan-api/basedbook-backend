import { Controller, Get, Post, Body, UseFilters } from '@nestjs/common';
import { RegisterDto } from '../dto';
import { AuthService } from '../auth.service';
import { VulcanExceptionFilter } from '../exception/vulcanException.filter';

@Controller('auth/register')
export class RegisterController {
  constructor(private authService: AuthService) {}

  @Post()
  @UseFilters(new VulcanExceptionFilter())
  async register(@Body() dto: RegisterDto): Promise<object> {
    return this.authService.signup(dto);
  }
}
