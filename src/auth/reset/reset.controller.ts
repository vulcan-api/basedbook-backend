import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { AuthService } from '../auth.service';

@Controller('auth/reset')
export class ResetController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendResetPasswordEmail(@Body('email') email: string) {
    await this.authService.sendResetEmail(email);
  }
  @Patch(':userHash')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Param('userHash') userHash: string,
  ): Promise<void> {
    await this.authService.resetPassword(userHash, dto.newPassword);
  }
}
