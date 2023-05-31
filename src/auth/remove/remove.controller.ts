import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { RemoveService } from './remove.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../decorator/getUser.decorator';
import { JwtAuthDto } from '../dto/jwt-auth.dto';
@UseGuards(AuthGuard('jwt'))
@Controller('auth/remove')
export class RemoveController {
  constructor(private readonly removeService: RemoveService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async removeAccount(@GetUser() requester: JwtAuthDto): Promise<void> {
    await this.removeService.removeUser(requester.userId);
  }
}
