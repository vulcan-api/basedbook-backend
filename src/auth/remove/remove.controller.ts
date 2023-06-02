import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { RemoveService } from './remove.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../decorator/getUser.decorator';
import { JwtAuthDto } from '../dto/jwt-auth.dto';
import { RemoveAccountDto } from './dto/remove-account.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('auth/remove')
export class RemoveController {
  constructor(private readonly removeService: RemoveService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async removeAccount(
    @GetUser() requester: JwtAuthDto,
    @Body() dto: RemoveAccountDto,
  ): Promise<void> {
    if (
      !(await this.removeService.checkIfUserExists(
        requester.userId,
        dto.password,
      ))
    )
      throw new ForbiddenException('Please provide correct password!');

    await this.removeService.removeUser(requester.userId);
  }
}
